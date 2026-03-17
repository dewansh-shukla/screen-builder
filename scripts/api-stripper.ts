#!/usr/bin/env tsx
/**
 * api-stripper.ts
 *
 * Transforms React component files synced from the main Zapigo app by removing
 * API dependencies (React Query, axios, firebase, auth hooks, etc.) and replacing
 * them with prop-based UI equivalents suitable for the mockup environment.
 *
 * Usage:
 *   npx tsx scripts/api-stripper.ts <source-file> <target-file>
 *
 * Programmatic:
 *   import { stripApiFromFile } from './api-stripper';
 *   const result = stripApiFromFile('src/EditModal.tsx', 'mockups/edit-modal.tsx');
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Configuration: blocked import sources
// ---------------------------------------------------------------------------

const BLOCKED_IMPORT_SOURCES = [
  // React Query
  "@tanstack/react-query",
  // Internal API / service libs
  "@/lib/axios",
  "@/lib/c56Api",
  "@/lib/universal",
  "@/lib/paymentApi",
  "@/lib/affiliate-api",
  "@/lib/imagekit",
  "@/lib/firebase",
  "@/lib/gallery-api",
  // Auth
  "@/hooks/useAuth",
  "@/hooks/use-toast",
  "@/store/useAuthStore",
  // Services
  "@/services/",
  // App route service imports (e.g. @/app/(events)/services/eventApi)
  "@/app/",
  // Toast libs
  "sonner",
  // HTTP
  "axios",
];

/** Regex patterns for dynamic blocked import matching */
const BLOCKED_IMPORT_PATTERNS: RegExp[] = [
  /^@\/lib\/\w+Service$/, // @/lib/themeLibraryService, etc.
  /^@\/lib\/\w+Api$/,     // @/lib/someApi (catches any *Api not already in exact list)
];

// ---------------------------------------------------------------------------
// Mock return values
// ---------------------------------------------------------------------------

const MOCK_QUERY_RETURN =
  "{ data: undefined, isLoading: false, isFetching: false, error: null, refetch: () => Promise.resolve({} as any), isSuccess: false, isError: false, status: 'idle' as const }";

const MOCK_MUTATION_RETURN =
  "{ mutate: () => {}, mutateAsync: async () => ({} as any), isPending: false, isLoading: false, error: null, reset: () => {}, isSuccess: false, isError: false, data: undefined, status: 'idle' as const }";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExtractedProp {
  name: string;
  type: string;
  defaultValue?: string;
  comment?: string;
}

interface MutationInfo {
  variableName: string; // e.g. "updateEventMutation"
  callbackPropName: string; // e.g. "onUpdateEvent"
  pendingPropName: string; // e.g. "isUpdatingEvent"
}

interface QueryInfo {
  dataAlias: string; // e.g. "eventData"
  typeParam: string | null; // e.g. "EventResponse"
  isLoadingAlias: string; // e.g. "isLoading"
  errorAlias: string | null;
}

interface StripResult {
  transformed: string;
  mockFile: string;
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a camelCase mutation variable like "updateEventMutation" to a callback name like "onUpdateEvent" */
function mutationVarToCallbackName(varName: string): string {
  // Strip trailing "Mutation" or "mutation"
  const base = varName.replace(/[Mm]utation$/, "");
  // Capitalize first letter and prefix with "on"
  return "on" + base.charAt(0).toUpperCase() + base.slice(1);
}

/** Convert a mutation variable to an isPending prop name */
function mutationVarToPendingName(varName: string): string {
  const base = varName.replace(/[Mm]utation$/, "");
  return "is" + base.charAt(0).toUpperCase() + base.slice(1) + "Pending";
}

/** Check if an import source matches any blocked pattern */
function isBlockedImport(source: string): boolean {
  // Exact or prefix match against BLOCKED_IMPORT_SOURCES
  const exactMatch = BLOCKED_IMPORT_SOURCES.some((blocked) => {
    // For patterns ending with "/" we do a startsWith check
    if (blocked.endsWith("/")) {
      return source.startsWith(blocked) || source === blocked.slice(0, -1);
    }
    return source === blocked;
  });
  if (exactMatch) return true;

  // Regex pattern match
  return BLOCKED_IMPORT_PATTERNS.some((pattern) => pattern.test(source));
}

/**
 * Find the end of a function call / object literal that starts at `startIndex`
 * by counting balanced braces/parens. Returns the index of the closing delimiter.
 */
function findBalancedEnd(
  code: string,
  startIndex: number,
  openChar: string = "(",
  closeChar: string = ")"
): number {
  let depth = 0;
  let inString: string | null = null;
  let escaped = false;
  let inTemplateLiteral = false;

  for (let i = startIndex; i < code.length; i++) {
    const ch = code[i];

    // Handle escape sequences inside strings
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }

    // Handle string boundaries
    if (inString) {
      if (ch === inString) {
        if (inString === "`") inTemplateLiteral = false;
        inString = null;
      }
      continue;
    }

    // Start of string
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      if (ch === "`") inTemplateLiteral = true;
      continue;
    }

    // Skip single-line comments
    if (ch === "/" && i + 1 < code.length) {
      if (code[i + 1] === "/") {
        // Skip to end of line
        const eol = code.indexOf("\n", i);
        if (eol !== -1) i = eol;
        else i = code.length;
        continue;
      }
      if (code[i + 1] === "*") {
        // Skip to end of block comment
        const end = code.indexOf("*/", i + 2);
        if (end !== -1) i = end + 1;
        else i = code.length;
        continue;
      }
    }

    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1; // unbalanced
}

/**
 * Replace all occurrences of a pattern found via regex, using balanced delimiter
 * matching to find the full span of each match.
 */
function replaceWithBalancedParens(
  code: string,
  pattern: RegExp,
  replacement: (fullMatch: string, regexMatch: RegExpExecArray) => string
): string {
  // Work from end to start to preserve indices
  const matches: { start: number; end: number; regexMatch: RegExpExecArray }[] = [];
  let m: RegExpExecArray | null;
  const patternCopy = new RegExp(pattern.source, pattern.flags);

  while ((m = patternCopy.exec(code)) !== null) {
    // Find the opening paren at the end of the regex match
    const parenStart = code.indexOf("(", m.index + m[0].length - 1);
    if (parenStart === -1) continue;
    const parenEnd = findBalancedEnd(code, parenStart, "(", ")");
    if (parenEnd === -1) continue;

    matches.push({
      start: m.index,
      end: parenEnd + 1,
      regexMatch: m,
    });
  }

  // Replace from end to start
  let result = code;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end, regexMatch } = matches[i];
    const fullMatch = result.slice(start, end);
    const rep = replacement(fullMatch, regexMatch);
    result = result.slice(0, start) + rep + result.slice(end);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main transform function
// ---------------------------------------------------------------------------

export function stripApiFromFile(
  sourcePath: string,
  targetPath: string
): StripResult {
  const source = fs.readFileSync(sourcePath, "utf-8");
  const warnings: string[] = [];
  const extractedProps: ExtractedProp[] = [];
  const mutations: MutationInfo[] = [];
  const queries: QueryInfo[] = [];
  let code = source;

  // =========================================================================
  // STEP 1: Remove blocked import lines (preserve type-only imports)
  // =========================================================================

  const removedImportSpecifiers: string[] = [];

  // Handle multi-line imports first (import {\n  ...\n} from '...')
  const multiLineImportRegex =
    /^import\s+(?:type\s+)?\{[^}]*\}\s+from\s+['"]([^'"]+)['"]\s*;?\s*$/gm;

  code = code.replace(multiLineImportRegex, (match, importSource: string) => {
    // Preserve type-only imports — they contain no runtime API code
    if (/^import\s+type\s+/.test(match)) {
      return match;
    }

    if (isBlockedImport(importSource)) {
      // Collect what was imported so we know what identifiers are now undefined
      const specifierMatch = match.match(/\{([^}]*)\}/s);
      if (specifierMatch) {
        specifierMatch[1].split(",").forEach((s) => {
          // Remove inline comments and whitespace
          const cleaned = s.replace(/\/\/.*$/gm, "").trim().replace(/\s+as\s+\w+/, "").trim();
          if (cleaned) removedImportSpecifiers.push(cleaned);
        });
      }
      // Comment out every line of the multi-line import
      const lines = match.split("\n");
      return lines.map((line) => `// [STRIPPED] ${line}`).join("\n");
    }
    return match;
  });

  // Handle single-line imports: import X from '...' and import { X } from '...'
  const singleLineImportRegex =
    /^import\s+(?:(?:type\s+)?(?:\{[^}]*\}|[\w*]+(?:\s*,\s*\{[^}]*\})?)\s+from\s+)?['"]([^'"]+)['"]\s*;?\s*$/gm;

  code = code.replace(singleLineImportRegex, (match, importSource: string) => {
    // Skip already-stripped lines
    if (match.trimStart().startsWith("//")) return match;

    // Preserve type-only imports — they contain no runtime API code
    if (/^import\s+type\s+/.test(match)) {
      return match;
    }

    if (isBlockedImport(importSource)) {
      // Collect what was imported so we know what identifiers are now undefined
      const specifierMatch = match.match(/\{([^}]+)\}/);
      if (specifierMatch) {
        specifierMatch[1].split(",").forEach((s) => {
          const cleaned = s.trim().replace(/\s+as\s+\w+/, "").trim();
          if (cleaned) removedImportSpecifiers.push(cleaned);
        });
      }
      // Also collect default imports
      const defaultMatch = match.match(
        /^import\s+([\w]+)\s+from/
      );
      if (defaultMatch) {
        removedImportSpecifiers.push(defaultMatch[1]);
      }
      return `// [STRIPPED] ${match.trim()}`;
    }
    return match;
  });

  // =========================================================================
  // STEP 2: Handle useQuery calls — const { data, ... } = useQuery(...)
  // =========================================================================

  // Pattern: const { data: alias, isLoading, error } = useQuery<Type>({...})
  // Also: const { data, isLoading } = useQuery({...})
  const useQueryRegex =
    /const\s+\{([^}]+)\}\s*=\s*useQuery(?:<([^>]+)>)?\s*\(/g;
  let queryMatch: RegExpExecArray | null;

  while ((queryMatch = useQueryRegex.exec(code)) !== null) {
    const destructured = queryMatch[1];
    const typeParam = queryMatch[2] || null;

    // Parse destructured properties
    let dataAlias = "data";
    let isLoadingAlias = "isLoading";
    let errorAlias: string | null = null;

    destructured.split(",").forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.startsWith("data:")) {
        dataAlias = trimmed.replace("data:", "").trim();
      } else if (trimmed.startsWith("data")) {
        dataAlias = "data";
      } else if (
        trimmed === "isLoading" ||
        trimmed.startsWith("isLoading:")
      ) {
        isLoadingAlias = trimmed.includes(":")
          ? trimmed.split(":")[1].trim()
          : "isLoading";
      } else if (trimmed === "error" || trimmed.startsWith("error:")) {
        errorAlias = trimmed.includes(":")
          ? trimmed.split(":")[1].trim()
          : "error";
      }
    });

    queries.push({ dataAlias, typeParam, isLoadingAlias, errorAlias });

    extractedProps.push({
      name: dataAlias,
      type: typeParam || "any",
      defaultValue: "undefined",
      comment: "Data from useQuery — pass as prop",
    });
    extractedProps.push({
      name: isLoadingAlias,
      type: "boolean",
      defaultValue: "false",
      comment: "Loading state from useQuery",
    });
    if (errorAlias) {
      extractedProps.push({
        name: errorAlias,
        type: "Error | null",
        defaultValue: "null",
        comment: "Error state from useQuery",
      });
    }
  }

  // Remove the useQuery assignment + call using balanced paren matching
  code = replaceWithBalancedParens(
    code,
    /const\s+\{[^}]+\}\s*=\s*useQuery(?:<[^>]+>)?\s*\(/g,
    (fullMatch) => {
      // Include trailing semicolon
      return "// [STRIPPED] useQuery — data now comes from props";
    }
  );
  // Clean up trailing semicolons left after replacement
  code = code.replace(
    /\/\/ \[STRIPPED\] useQuery — data now comes from props\s*;/g,
    "// [STRIPPED] useQuery — data now comes from props"
  );

  // =========================================================================
  // STEP 2b: Handle `return useQuery(...)` — direct return pattern
  // =========================================================================

  code = replaceWithBalancedParens(
    code,
    /return\s+useQuery(?:<[^>]+>)?\s*\(/g,
    () => `return ${MOCK_QUERY_RETURN}`
  );
  // Clean up trailing semicolons (the balanced replacement eats the closing paren but not the semicolon)
  code = code.replace(
    new RegExp(`return ${escapeRegExp(MOCK_QUERY_RETURN)}\\s*;?`, "g"),
    `return ${MOCK_QUERY_RETURN};`
  );

  // =========================================================================
  // STEP 2c: Handle arrow fn implicit return: `=> useQuery(...)`
  // =========================================================================

  code = replaceWithBalancedParens(
    code,
    /=>\s*\n?\s*useQuery(?:<[^>]+>)?\s*\(/g,
    () => `=> (${MOCK_QUERY_RETURN})`
  );

  // =========================================================================
  // STEP 3: Handle useMutation calls — const X = useMutation(...)
  // =========================================================================

  // Pattern: const mutationVar = useMutation({...})
  const useMutationRegex =
    /const\s+([\w]+)\s*=\s*useMutation\s*\(/g;
  let mutationMatch: RegExpExecArray | null;

  // Reset regex
  useMutationRegex.lastIndex = 0;
  let mutationCode = code;

  while ((mutationMatch = useMutationRegex.exec(mutationCode)) !== null) {
    const varName = mutationMatch[1];
    const callbackPropName = mutationVarToCallbackName(varName);
    const pendingPropName = mutationVarToPendingName(varName);

    mutations.push({
      variableName: varName,
      callbackPropName,
      pendingPropName,
    });

    extractedProps.push({
      name: callbackPropName,
      type: "(...args: any[]) => void",
      defaultValue: "() => {}",
      comment: `Callback replacing ${varName}.mutate()`,
    });
    extractedProps.push({
      name: pendingPropName,
      type: "boolean",
      defaultValue: "false",
      comment: `Pending state replacing ${varName}.isPending`,
    });
  }

  // Remove useMutation assignment lines and their multiline bodies
  // Strategy: find "const X = useMutation(" then balance parens to find the end
  for (const mut of mutations) {
    const mutStartRegex = new RegExp(
      `const\\s+${mut.variableName}\\s*=\\s*useMutation\\s*\\(`
    );
    const startMatch = mutStartRegex.exec(code);
    if (startMatch) {
      const callStart = startMatch.index;
      const parenStart = code.indexOf("(", callStart + startMatch[0].length - 1);
      const parenEnd = findBalancedEnd(code, parenStart, "(", ")");
      if (parenEnd !== -1) {
        // Include trailing semicolon and newline if present
        let endIdx = parenEnd + 1;
        if (code[endIdx] === ";") endIdx++;
        if (code[endIdx] === "\n") endIdx++;
        const removed = code.slice(callStart, endIdx);
        code = code.replace(
          removed,
          `// [STRIPPED] ${mut.variableName} — use ${mut.callbackPropName} prop instead\n`
        );
      }
    }
  }

  // Replace mutation.mutate(...) and mutation.mutateAsync(...) calls
  for (const mut of mutations) {
    // Replace mutationVar.mutate(args) → callbackPropName?.(args)
    const mutateCallRegex = new RegExp(
      `${mut.variableName}\\.mutate(?:Async)?\\(`,
      "g"
    );
    code = code.replace(mutateCallRegex, `${mut.callbackPropName}?.(`);

    // Replace mutationVar.isPending → pendingPropName
    const isPendingRegex = new RegExp(
      `${mut.variableName}\\.isPending`,
      "g"
    );
    code = code.replace(isPendingRegex, mut.pendingPropName);

    // Replace mutationVar.isLoading → pendingPropName (older react-query)
    const isLoadingRegex = new RegExp(
      `${mut.variableName}\\.isLoading`,
      "g"
    );
    code = code.replace(isLoadingRegex, mut.pendingPropName);

    // Replace mutationVar.isSuccess, mutationVar.isError etc with TODO
    const otherStateRegex = new RegExp(
      `${mut.variableName}\\.(isSuccess|isError|error|data|reset|status)`,
      "g"
    );
    code = code.replace(otherStateRegex, (match, prop) => {
      warnings.push(
        `${mut.variableName}.${prop} usage detected — needs manual review`
      );
      return `/* TODO: Manual review needed — ${match} */ undefined`;
    });
  }

  // =========================================================================
  // STEP 3b: Handle `return useMutation(...)` — direct return pattern
  // =========================================================================

  code = replaceWithBalancedParens(
    code,
    /return\s+useMutation(?:<[^>]+>)?\s*\(/g,
    () => `return ${MOCK_MUTATION_RETURN}`
  );
  code = code.replace(
    new RegExp(`return ${escapeRegExp(MOCK_MUTATION_RETURN)}\\s*;?`, "g"),
    `return ${MOCK_MUTATION_RETURN};`
  );

  // =========================================================================
  // STEP 3c: Handle arrow fn implicit return: `=> useMutation(...)`
  // =========================================================================

  code = replaceWithBalancedParens(
    code,
    /=>\s*\n?\s*useMutation(?:<[^>]+>)?\s*\(/g,
    () => `=> (${MOCK_MUTATION_RETURN})`
  );

  // =========================================================================
  // STEP 4: Handle useAuth() / useAuthStore() calls
  // =========================================================================

  // Pattern: const { userData, sendOtp, ... } = useAuth();
  // Pattern: const { userData } = useAuthStore();
  const useAuthRegex =
    /const\s+\{([^}]+)\}\s*=\s*(?:useAuth|useAuthStore)\s*\(\s*\)\s*;?/g;
  let authMatch: RegExpExecArray | null;

  while ((authMatch = useAuthRegex.exec(code)) !== null) {
    const destructured = authMatch[1];
    destructured.split(",").forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;

      // Handle aliased destructuring: foo: bar
      const name = trimmed.includes(":")
        ? trimmed.split(":")[1].trim()
        : trimmed;

      // Determine sensible type/default based on common auth properties
      if (
        name === "userData" ||
        name === "user" ||
        name === "currentUser"
      ) {
        extractedProps.push({
          name,
          type: "{ id: string; name: string; email: string; phone?: string } | null",
          defaultValue: '{ id: "mock-user-1", name: "Test User", email: "test@example.com" }',
          comment: "User data from auth — pass as prop",
        });
      } else if (
        name.startsWith("is") &&
        !name.includes("(")
      ) {
        // Boolean flags like isAuthenticated, isSendingOtp, isVerifyingOtp
        extractedProps.push({
          name,
          type: "boolean",
          defaultValue: "false",
          comment: `Auth boolean state — pass as prop`,
        });
      } else {
        // Functions like sendOtp, verifyOtp, etc.
        extractedProps.push({
          name,
          type: "(...args: any[]) => void | Promise<void>",
          defaultValue: `(...args: any[]) => { console.log('${name} called', args); }`,
          comment: `Auth function — pass as prop`,
        });
      }
    });
  }

  // Remove the useAuth/useAuthStore lines
  code = code.replace(
    /const\s+\{[^}]+\}\s*=\s*(?:useAuth|useAuthStore)\s*\(\s*\)\s*;?/g,
    "// [STRIPPED] useAuth/useAuthStore — values now come from props"
  );

  // =========================================================================
  // STEP 5: Handle useQueryClient()
  // =========================================================================

  code = code.replace(
    /const\s+\w+\s*=\s*useQueryClient\s*\(\s*\)\s*;?/g,
    "// [STRIPPED] useQueryClient removed — no cache invalidation in mockup"
  );

  // Remove any remaining queryClient.invalidateQueries(...) calls
  // Use balanced parens for nested arguments
  code = replaceWithBalancedParens(
    code,
    /\w+\.invalidateQueries\s*\(/g,
    () => "// [STRIPPED] cache invalidation removed"
  );
  // Clean up trailing semicolons
  code = code.replace(
    /\/\/ \[STRIPPED\] cache invalidation removed\s*;/g,
    "// [STRIPPED] cache invalidation removed"
  );

  // Remove await queryClient... patterns
  code = replaceWithBalancedParens(
    code,
    /await\s+\w+\.(?:invalidateQueries|refetchQueries|setQueryData|removeQueries)\s*\(/g,
    () => "// [STRIPPED] query cache operation removed"
  );
  code = code.replace(
    /\/\/ \[STRIPPED\] query cache operation removed\s*;/g,
    "// [STRIPPED] query cache operation removed"
  );

  // =========================================================================
  // STEP 6: Handle toast calls
  // =========================================================================

  // useToast pattern: const { toast } = useToast();
  code = code.replace(
    /const\s+\{[^}]*toast[^}]*\}\s*=\s*useToast\s*\(\s*\)\s*;?/g,
    "// [STRIPPED] useToast — replaced with console.log\nconst toast = (...args: any[]) => console.log('[Toast]', ...args);"
  );

  // Sonner toast import was already stripped. Replace toast() calls with console.log.
  // toast("message") or toast.success("message") or toast.error("message")
  // We only do this if 'toast' was from a blocked import — check if toast is in removedImportSpecifiers
  if (removedImportSpecifiers.includes("toast")) {
    // Add a local toast shim near the top of the component
    // We'll do this after we assemble the final code — for now, add a declaration
    const toastShimComment =
      "// Toast shim (original was from sonner)\nconst toast = Object.assign(\n  (...args: any[]) => console.log('[Toast]', ...args),\n  {\n    success: (...args: any[]) => console.log('[Toast:success]', ...args),\n    error: (...args: any[]) => console.log('[Toast:error]', ...args),\n    info: (...args: any[]) => console.log('[Toast:info]', ...args),\n    warning: (...args: any[]) => console.log('[Toast:warning]', ...args),\n    loading: (...args: any[]) => console.log('[Toast:loading]', ...args),\n    dismiss: () => {},\n  }\n);\n";
    // Insert after the last import line
    const lastImportIndex = code.lastIndexOf("\nimport ");
    if (lastImportIndex !== -1) {
      const lineEnd = code.indexOf("\n", lastImportIndex + 1);
      // Find the end of the last import statement
      const afterImports = code.indexOf("\n", lineEnd);
      if (afterImports !== -1) {
        // Find a good insertion point — after all imports
        const importSectionEnd = findEndOfImports(code);
        code =
          code.slice(0, importSectionEnd) +
          "\n" +
          toastShimComment +
          code.slice(importSectionEnd);
      }
    }
  }

  // =========================================================================
  // STEP 7: Handle remaining references to removed identifiers
  // =========================================================================

  // Remove any remaining standalone import-like references: api.get, api.post, etc.
  // Use balanced paren matching to handle nested arguments correctly
  const apiVarNames = ["api", "universalApi", "c56Api", "paymentApi", "affiliateApi"];
  for (const apiVar of apiVarNames) {
    if (removedImportSpecifiers.includes(apiVar)) {
      // Use balanced paren matching for API calls
      code = replaceWithBalancedParens(
        code,
        new RegExp(
          `(?:await\\s+)?${apiVar}\\.(?:get|post|put|patch|delete|request)\\s*(?:<[^>]*>)?\\s*\\(`,
          "g"
        ),
        (fullMatch) => {
          return `/* [STRIPPED] ${apiVar} call */ undefined`;
        }
      );
    }
  }

  // =========================================================================
  // STEP 7b: Handle standalone function calls to removed imports
  // =========================================================================

  // For functions imported from blocked sources (e.g. createTheme, getTheme),
  // replace their calls with no-ops when they appear as standalone expressions
  // or inside arrow functions
  for (const specifier of removedImportSpecifiers) {
    // Skip common identifiers that are too generic to safely replace
    if (["default", "type", "React"].includes(specifier)) continue;
    // Skip identifiers that look like types (PascalCase ending in Payload, Response, etc.)
    if (/^[A-Z].*(?:Payload|Response|Params|Type|Interface|Props|Config)$/.test(specifier)) continue;

    // Replace direct calls: specifier(...) when used as expression statement
    // Be careful not to replace if it's part of a longer identifier
    const callRegex = new RegExp(
      `(?<=^|[^\\w.])${escapeRegExp(specifier)}\\s*\\(`,
      "gm"
    );

    // Only replace if it appears to be a function call (not a type reference)
    if (callRegex.test(code)) {
      code = replaceWithBalancedParens(
        code,
        new RegExp(`(?<![\\w.])${escapeRegExp(specifier)}\\s*\\(`, "g"),
        () => `/* [STRIPPED] ${specifier} call */ ((() => undefined) as any)()`
      );
    }
  }

  // =========================================================================
  // STEP 8: Add header comment
  // =========================================================================

  const timestamp = new Date().toISOString();
  const header = [
    "// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY",
    `// Source: ${sourcePath}`,
    `// Last synced: ${timestamp}`,
    "// API integrations stripped. Use props for data and callbacks.",
    "",
  ].join("\n");

  // Remove any existing header if re-running
  code = code.replace(
    /^\/\/ AUTO-SYNCED from zapigowebclient[^\n]*\n(?:\/\/[^\n]*\n)*/,
    ""
  );

  code = header + code;

  // =========================================================================
  // STEP 9: Add props interface comment block as guidance
  // =========================================================================

  if (extractedProps.length > 0) {
    const propsComment = buildPropsComment(extractedProps);
    // Insert after the header
    const headerEnd = code.indexOf("\n\n", header.length - 5);
    if (headerEnd !== -1) {
      code =
        code.slice(0, headerEnd) +
        "\n" +
        propsComment +
        code.slice(headerEnd);
    }
  }

  // =========================================================================
  // STEP 10: Scan for any remaining API patterns and add warnings
  // =========================================================================

  const remainingPatterns = [
    { pattern: /useQuery\s*[<(]/g, label: "useQuery" },
    { pattern: /useMutation\s*[<(]/g, label: "useMutation" },
    { pattern: /useQueryClient\s*\(/g, label: "useQueryClient" },
    { pattern: /useAuth\s*\(/g, label: "useAuth" },
    { pattern: /useAuthStore\s*\(/g, label: "useAuthStore" },
    { pattern: /uploadToImageKit/g, label: "uploadToImageKit" },
    { pattern: /(?<![.\w])mutateAsync\s*\(/g, label: "mutateAsync" },
  ];

  for (const { pattern, label } of remainingPatterns) {
    // Need to reset the regex for each scan
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(code)) !== null) {
      const idx = match.index;
      const lineStart = code.lastIndexOf("\n", idx) + 1;
      const line = code.slice(lineStart, idx);
      if (!line.includes("//") && !line.includes("/*") && !line.includes("STRIPPED")) {
        warnings.push(
          `Remaining ${label} usage detected — may need manual review`
        );
      }
    }
  }

  // =========================================================================
  // STEP 11: Generate companion .mock.ts file
  // =========================================================================

  const mockFile = generateMockFile(
    sourcePath,
    targetPath,
    extractedProps,
    mutations,
    queries
  );

  return { transformed: code, mockFile, warnings };
}

// ---------------------------------------------------------------------------
// Helper: escape string for use in RegExp
// ---------------------------------------------------------------------------

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Helper: find end of import section
// ---------------------------------------------------------------------------

function findEndOfImports(code: string): number {
  const lines = code.split("\n");
  let lastImportLine = 0;
  let inMultilineImport = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (inMultilineImport) {
      if (line.includes("from ") || line.endsWith(";") || line.endsWith("';") || line.endsWith('";')) {
        lastImportLine = i;
        inMultilineImport = false;
      }
      continue;
    }

    if (
      line.startsWith("import ") ||
      line.startsWith("// [STRIPPED]")
    ) {
      lastImportLine = i;
      // Check if this is a multiline import
      if (line.includes("{") && !line.includes("}")) {
        inMultilineImport = true;
      }
    }
  }

  // Return the character offset at the end of the last import line
  let offset = 0;
  for (let i = 0; i <= lastImportLine; i++) {
    offset += lines[i].length + 1; // +1 for newline
  }
  return offset;
}

// ---------------------------------------------------------------------------
// Helper: build props comment
// ---------------------------------------------------------------------------

function buildPropsComment(props: ExtractedProp[]): string {
  const lines = [
    "/*",
    " * ============================================================",
    " * EXTRACTED PROPS (added by api-stripper)",
    " * Add these to the component's props interface:",
    " * ============================================================",
  ];

  for (const prop of props) {
    if (prop.comment) {
      lines.push(` * // ${prop.comment}`);
    }
    lines.push(` * ${prop.name}?: ${prop.type};`);
  }

  lines.push(" * ============================================================");
  lines.push(" */");

  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Helper: generate mock file
// ---------------------------------------------------------------------------

function generateMockFile(
  sourcePath: string,
  targetPath: string,
  props: ExtractedProp[],
  mutations: MutationInfo[],
  queries: QueryInfo[]
): string {
  const componentFileName = path.basename(targetPath, path.extname(targetPath));
  const timestamp = new Date().toISOString();

  const lines: string[] = [
    `// Mock data and default props for ${componentFileName}`,
    `// Generated by api-stripper on ${timestamp}`,
    `// Source: ${sourcePath}`,
    "",
    "// ---------------------------------------------------------------------------",
    "// Default props — spread these when rendering the component in mockups",
    "// ---------------------------------------------------------------------------",
    "",
  ];

  // Build the default props object
  lines.push(`export const defaultProps = {`);

  for (const prop of props) {
    if (prop.comment) {
      lines.push(`  // ${prop.comment}`);
    }
    lines.push(`  ${prop.name}: ${prop.defaultValue ?? "undefined"},`);
  }

  lines.push(`} as const;`);
  lines.push("");

  // Generate sample mock data for query types
  if (queries.length > 0) {
    lines.push(
      "// ---------------------------------------------------------------------------"
    );
    lines.push(
      "// Mock data factories — customize these for realistic mockup data"
    );
    lines.push(
      "// ---------------------------------------------------------------------------"
    );
    lines.push("");

    for (const query of queries) {
      const factoryName = `create${query.dataAlias.charAt(0).toUpperCase() + query.dataAlias.slice(1)}`;
      lines.push(`export function ${factoryName}(overrides: Record<string, any> = {}) {`);
      lines.push(`  return {`);
      lines.push(`    // TODO: Add realistic mock fields matching ${query.typeParam || "the data shape"}`);
      lines.push(`    id: "mock-1",`);
      lines.push(`    ...overrides,`);
      lines.push(`  };`);
      lines.push(`}`);
      lines.push("");
    }
  }

  // Generate no-op callbacks for mutations
  if (mutations.length > 0) {
    lines.push(
      "// ---------------------------------------------------------------------------"
    );
    lines.push(
      "// Callback stubs — use these or provide custom handlers in mockups"
    );
    lines.push(
      "// ---------------------------------------------------------------------------"
    );
    lines.push("");

    for (const mut of mutations) {
      lines.push(
        `export const ${mut.callbackPropName} = (...args: any[]) => {`
      );
      lines.push(
        `  console.log('${mut.callbackPropName} called with:', args);`
      );
      lines.push(`};`);
      lines.push("");
    }
  }

  // Export a ready-to-use mockup wrapper suggestion
  lines.push(
    "// ---------------------------------------------------------------------------"
  );
  lines.push("// Usage example in a mockup screen:");
  lines.push(
    "// ---------------------------------------------------------------------------"
  );
  lines.push("//");
  lines.push(`// import Component from './${componentFileName}';`);
  lines.push(`// import { defaultProps } from './${componentFileName}.mock';`);
  lines.push("//");
  lines.push("// export default function MockScreen() {");
  lines.push("//   return <Component {...defaultProps} />;");
  lines.push("// }");
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/api-stripper.ts <source-file> <target-file>");
    console.error("");
    console.error("  <source-file>  Path to the original component from the main app");
    console.error("  <target-file>  Path where the stripped component will be written");
    console.error("");
    console.error("Example:");
    console.error("  npx tsx scripts/api-stripper.ts ../zapigowebclient/src/components/EditEventModal.tsx src/components/application/edit-event-modal.tsx");
    process.exit(1);
  }

  const [sourcePath, targetPath] = args;

  // Validate source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  // Ensure target directory exists
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  console.log("=== API Stripper ===");
  console.log(`Source: ${sourcePath}`);
  console.log(`Target: ${targetPath}`);
  console.log("");

  const result = stripApiFromFile(sourcePath, targetPath);

  // Write transformed file
  fs.writeFileSync(targetPath, result.transformed, "utf-8");
  console.log(`Wrote transformed component: ${targetPath}`);

  // Write mock file
  const mockPath = targetPath.replace(/\.(tsx?)$/, ".mock.$1");
  fs.writeFileSync(mockPath, result.mockFile, "utf-8");
  console.log(`Wrote mock data file:        ${mockPath}`);

  // Report warnings
  if (result.warnings.length > 0) {
    console.log("");
    console.log(`Warnings (${result.warnings.length}):`);
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`);
    }
  }

  console.log("");
  console.log("Done. Review the output and add proper prop types to the component.");
}

// Run CLI if executed directly
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("api-stripper.ts") ||
    process.argv[1].endsWith("api-stripper.js"));

if (isDirectRun) {
  main();
}
