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
  return BLOCKED_IMPORT_SOURCES.some((blocked) => {
    // For patterns ending with "/" we do a startsWith check
    if (blocked.endsWith("/")) {
      return source.startsWith(blocked) || source === blocked.slice(0, -1);
    }
    return source === blocked;
  });
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
  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === openChar) depth++;
    else if (code[i] === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1; // unbalanced
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
  // STEP 1: Remove blocked import lines
  // =========================================================================

  // Match import statements (single-line and multi-line)
  // Handles: import { X } from 'module';  and  import X from 'module';
  const importRegex =
    /^import\s+(?:(?:type\s+)?(?:\{[^}]*\}|[\w*]+(?:\s*,\s*\{[^}]*\})?)\s+from\s+)?['"]([^'"]+)['"]\s*;?\s*$/gm;

  const removedImportSpecifiers: string[] = [];

  code = code.replace(importRegex, (match, importSource: string) => {
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
  // STEP 2: Handle useQuery calls
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

  // Remove the useQuery call lines (including the full expression spanning multiple lines)
  code = code.replace(
    /const\s+\{[^}]+\}\s*=\s*useQuery(?:<[^>]+>)?\s*\(/g,
    (match) => {
      // Find the matching closing paren from the original code position
      return "// [STRIPPED] useQuery replaced with props\n// ";
    }
  );

  // Clean up: remove any remaining useQuery(...) blocks more aggressively
  // We need to handle the multiline object argument
  const useQueryFullRegex =
    /\/\/ \[STRIPPED\] useQuery replaced with props\n\/\/ [^;]*?(?:\{[\s\S]*?\}\s*\))\s*;?/g;
  code = code.replace(useQueryFullRegex, (match) => {
    return "// [STRIPPED] useQuery — data now comes from props";
  });

  // Simpler fallback: remove lines that are just leftover fragments
  code = code.replace(
    /\/\/ \[STRIPPED\] useQuery replaced with props\n\/\/ .*$/gm,
    "// [STRIPPED] useQuery — data now comes from props"
  );

  // =========================================================================
  // STEP 3: Handle useMutation calls
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
  code = code.replace(
    /\w+\.invalidateQueries\s*\([^)]*\)\s*;?/g,
    "// [STRIPPED] cache invalidation removed"
  );

  // Remove await queryClient... patterns
  code = code.replace(
    /await\s+\w+\.(?:invalidateQueries|refetchQueries|setQueryData|removeQueries)\s*\([^)]*\)\s*;?/g,
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
  const apiVarNames = ["api", "universalApi", "c56Api", "paymentApi"];
  for (const apiVar of apiVarNames) {
    if (removedImportSpecifiers.includes(apiVar)) {
      const apiCallRegex = new RegExp(
        `(?:await\\s+)?${apiVar}\\.(?:get|post|put|patch|delete|request)\\s*(?:<[^>]*>)?\\s*\\([^)]*\\)`,
        "g"
      );
      code = code.replace(apiCallRegex, (match) => {
        warnings.push(`Direct API call detected: ${match.slice(0, 60)}...`);
        return `/* TODO: Manual review needed — ${apiVar} call stripped */ undefined`;
      });
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
    { pattern: /mutateAsync/g, label: "mutateAsync" },
  ];

  for (const { pattern, label } of remainingPatterns) {
    const matches = code.match(pattern);
    if (matches) {
      // Filter out matches inside comments
      for (const m of matches) {
        const idx = code.indexOf(m);
        const lineStart = code.lastIndexOf("\n", idx) + 1;
        const line = code.slice(lineStart, idx);
        if (!line.includes("//") && !line.includes("/*") && !line.includes("STRIPPED")) {
          warnings.push(
            `Remaining ${label} usage detected — may need manual review`
          );
        }
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
