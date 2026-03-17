# Component Catalog

> Auto-generated reference of all available design system components.

---

## Base Components

### Button
**Import:** `import { Button } from '@/components/base/buttons/button'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md" \| "lg" \| "xl"` | `"sm"` |
| color | `"primary" \| "secondary" \| "tertiary" \| "link-gray" \| "link-color" \| "primary-destructive" \| "secondary-destructive" \| "tertiary-destructive" \| "link-destructive"` | `"primary"` |
| iconLeading | `FC \| ReactNode` | — |
| iconTrailing | `FC \| ReactNode` | — |
| isDisabled | `boolean` | — |
| isLoading | `boolean` | — |
| showTextWhileLoading | `boolean` | — |
| href | `string` | — |

```tsx
<Button size="md" color="primary" iconLeading={Plus}>Add Guest</Button>
<Button color="secondary" iconLeading={Download01}>Export</Button>
<Button color="link-color" href="/settings">Settings</Button>
<Button color="primary-destructive" iconLeading={Trash02}>Delete</Button>
```

---

### ButtonUtility
**Import:** `import { ButtonUtility } from '@/components/base/buttons/button-utility'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md" \| "lg" \| "xl"` | `"sm"` |
| color | `"secondary" \| "tertiary"` | `"secondary"` |
| icon | `FC` | — |
| tooltip | `string` | — |

```tsx
<ButtonUtility icon={Settings01} tooltip="Settings" />
```

---

### Input
**Import:** `import { Input, InputBase } from '@/components/base/input/input'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | `"sm"` |
| label | `string` | — |
| hint | `string` | — |
| placeholder | `string` | — |
| icon | `FC` | — |
| tooltip | `string` | — |
| isRequired | `boolean` | — |
| isDisabled | `boolean` | — |
| isInvalid | `boolean` | — |

```tsx
<Input label="Email" placeholder="olivia@example.com" icon={Mail01} />
<Input label="Password" type="password" isRequired hint="Min 8 characters" />
```

---

### InputGroup
**Import:** `import { InputGroup } from '@/components/base/input/input-group'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | `"sm"` |
| label | `string` | — |
| hint | `string` | — |
| prefix | `string` | — |
| leadingAddon | `ReactNode` | — |
| trailingAddon | `ReactNode` | — |

```tsx
<InputGroup label="Website" prefix="https://">
  <InputBase placeholder="www.example.com" />
</InputGroup>
```

---

### Select
**Import:** `import { Select } from '@/components/base/select/select'`

**Compound:** `Select.Item`, `Select.ComboBox`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | `"sm"` |
| label | `string` | — |
| hint | `string` | — |
| placeholder | `string` | — |
| items | `SelectItemType[]` | — |
| placeholderIcon | `FC \| ReactNode` | — |

**SelectItemType:** `{ id, label?, avatarUrl?, supportingText?, icon?, isDisabled? }`

```tsx
<Select label="Team" placeholder="Select member" items={users}>
  {(item) => (
    <Select.Item id={item.id} supportingText={item.email}>
      {item.name}
    </Select.Item>
  )}
</Select>

<Select.ComboBox label="Search" placeholder="Find users" items={users}>
  {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
</Select.ComboBox>
```

---

### MultiSelect
**Import:** `import { MultiSelect } from '@/components/base/select/multi-select'`

**Compound:** `MultiSelect.Item`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | `"sm"` |
| label | `string` | — |
| placeholder | `string` | `"Search"` |
| items | `SelectItemType[]` | — |
| selectedItems | `ListData<SelectItemType>` | required |
| placeholderIcon | `FC` | — |

---

### Checkbox
**Import:** `import { Checkbox, CheckboxBase } from '@/components/base/checkbox/checkbox'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | `"sm"` |
| label | `string` | — |
| hint | `string` | — |
| isSelected | `boolean` | — |
| isDisabled | `boolean` | — |
| isIndeterminate | `boolean` | — |

```tsx
<Checkbox label="Remember me" hint="Save login for next time" />
```

> **WARNING:** `<Checkbox>` cannot be used inside `<Table>` components (React Aria slot conflict). Use `<CheckboxBase>` wrapped in a `<button>` instead:
> ```tsx
> <button onClick={handleToggle} className="flex items-center">
>   <CheckboxBase size="sm" isSelected={checked} />
> </button>
> ```

---

### Toggle
**Import:** `import { Toggle } from '@/components/base/toggle/toggle'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | `"sm"` |
| label | `string` | — |
| hint | `string` | — |
| slim | `boolean` | — |
| isSelected | `boolean` | — |
| isDisabled | `boolean` | — |

```tsx
<Toggle label="Email notifications" hint="Get notified about updates" />
```

---

### RadioGroup / RadioButton
**Import:** `import { RadioGroup, RadioButton } from '@/components/base/radio-buttons/radio-buttons'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | `"sm"` |
| label | `string` | — |
| hint | `string` | — |

```tsx
<RadioGroup>
  <RadioButton value="email" label="Email" hint="Send via email" />
  <RadioButton value="sms" label="SMS" hint="Send via text" />
</RadioGroup>
```

---

### Badge / BadgeWithDot / BadgeWithIcon
**Import:** `import { Badge, BadgeWithDot, BadgeWithIcon } from '@/components/base/badges/badges'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md" \| "lg"` | `"md"` |
| type | `"pill-color" \| "color" \| "modern"` | `"pill-color"` |
| color | `"gray" \| "brand" \| "error" \| "warning" \| "success" \| "blue" \| "indigo" \| "purple" \| "pink" \| "orange" \| "rose"` | — |

```tsx
<Badge color="success" size="sm">Active</Badge>
<BadgeWithDot color="warning">Pending</BadgeWithDot>
<BadgeWithIcon iconLeading={ArrowUp} color="success">12%</BadgeWithIcon>
```

---

### Avatar
**Import:** `import { Avatar } from '@/components/base/avatar/avatar'`

| Prop | Type | Default |
|------|------|---------|
| size | `"xxs" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` |
| src | `string` | — |
| alt | `string` | — |
| initials | `string` | — |
| status | `"online" \| "offline"` | — |
| verified | `boolean` | — |

```tsx
<Avatar src="/avatar.jpg" alt="Olivia" size="md" status="online" />
<Avatar initials="OR" size="lg" />
```

---

### AvatarLabelGroup
**Import:** `import { AvatarLabelGroup } from '@/components/base/avatar/avatar-label-group'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md" \| "lg" \| "xl"` | required |
| title | `string \| ReactNode` | — |
| subtitle | `string \| ReactNode` | — |
| + all Avatar props | | |

```tsx
<AvatarLabelGroup src="/avatar.jpg" title="Olivia Rhye" subtitle="olivia@example.com" size="md" />
```

---

### Card
**Import:** `import { Card, CardContent } from '@/components/base/card'`

```tsx
<Card className="p-6">
  <CardContent>Content here</CardContent>
</Card>
```

---

### Tooltip
**Import:** `import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'`

| Prop | Type | Default |
|------|------|---------|
| title | `ReactNode` | required |
| description | `ReactNode` | — |
| arrow | `boolean` | `false` |
| placement | `Placement` | `"top"` |

```tsx
<TooltipTrigger>
  <Button>Hover me</Button>
  <Tooltip title="Help text" />
</TooltipTrigger>
```

---

### TextArea
**Import:** `import { TextArea } from '@/components/base/textarea/textarea'`

| Prop | Type | Default |
|------|------|---------|
| label | `string` | — |
| hint | `string` | — |
| placeholder | `string` | — |
| rows | `number` | — |
| isDisabled | `boolean` | — |
| isInvalid | `boolean` | — |

```tsx
<TextArea label="Description" placeholder="Enter details..." rows={4} />
```

---

### Dropdown
**Import:** `import { Dropdown } from '@/components/base/dropdown/dropdown'`

**Compound:** `Dropdown.Root`, `Dropdown.Popover`, `Dropdown.Menu`, `Dropdown.Section`, `Dropdown.SectionHeader`, `Dropdown.Item`, `Dropdown.Separator`, `Dropdown.DotsButton`

```tsx
<Dropdown.Root>
  <Button>Options</Button>
  <Dropdown.Popover>
    <Dropdown.Menu>
      <Dropdown.Item icon={Edit03} label="Edit" />
      <Dropdown.Item icon={Copy01} label="Duplicate" />
      <Dropdown.Separator />
      <Dropdown.Item icon={Trash02} label="Delete" />
    </Dropdown.Menu>
  </Dropdown.Popover>
</Dropdown.Root>
```

---

### Accordion
**Import:** `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/base/accordion/accordion'`

| Prop | Type | Default |
|------|------|---------|
| type | `"single" \| "multiple"` | — |
| collapsible | `boolean` | — |

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="faq-1">
    <AccordionTrigger>Question?</AccordionTrigger>
    <AccordionContent>Answer.</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### Slider
**Import:** `import { Slider } from '@/components/base/slider/slider'`

| Prop | Type | Default |
|------|------|---------|
| minValue | `number` | `0` |
| maxValue | `number` | `100` |
| labelPosition | `"default" \| "bottom" \| "top-floating" \| "bottom-floating"` | `"default"` |

```tsx
<Slider defaultValue={50} minValue={0} maxValue={100} />
```

---

### TagGroup / Tag
**Import:** `import { TagGroup, TagList, Tag } from '@/components/base/tags/tags'`

| Prop | Type | Default |
|------|------|---------|
| label | `string` | required (TagGroup) |
| size | `"sm" \| "md" \| "lg"` | `"sm"` |
| selectionMode | `"none" \| "single" \| "multiple"` | `"none"` |

```tsx
<TagGroup label="Tags" size="md">
  <TagList>
    <Tag id="1">Design</Tag>
    <Tag id="2">Development</Tag>
  </TagList>
</TagGroup>
```

---

### ProgressBar
**Import:** `import { ProgressBar } from '@/components/base/progress-indicators/progress-indicators'`

| Prop | Type | Default |
|------|------|---------|
| value | `number` | required |
| min | `number` | `0` |
| max | `number` | `100` |
| labelPosition | `"right" \| "bottom" \| "top-floating" \| "bottom-floating"` | — |

```tsx
<ProgressBar value={65} labelPosition="right" />
```

---

### ButtonGroup
**Import:** `import { ButtonGroup, ButtonGroupItem } from '@/components/base/button-group/button-group'`

| Prop | Type | Default |
|------|------|---------|
| size | `"sm" \| "md" \| "lg"` | `"md"` |

```tsx
<ButtonGroup size="md">
  <ButtonGroupItem iconLeading={List}>List</ButtonGroupItem>
  <ButtonGroupItem iconLeading={Grid01}>Grid</ButtonGroupItem>
</ButtonGroup>
```

---

### PinInput
**Import:** `import { PinInput } from '@/components/base/pin-input/pin-input'`

**Compound:** `PinInput.Root`, `PinInput.Group`, `PinInput.Slot`, `PinInput.Label`, `PinInput.Separator`

```tsx
<PinInput.Root size="md">
  <PinInput.Label>Verification Code</PinInput.Label>
  <PinInput.Group maxLength={6}>
    {[0,1,2,3,4,5].map(i => <PinInput.Slot key={i} index={i} />)}
  </PinInput.Group>
</PinInput.Root>
```

---

### TextEditor
**Import:** `import { TextEditor } from '@/components/base/text-editor/text-editor'`

**Compound:** `TextEditor.Root`, `TextEditor.Content`, `TextEditor.Label`, `TextEditor.Toolbar`, `TextEditor.HintText`

```tsx
<TextEditor.Root placeholder="Write something...">
  <TextEditor.Label>Description</TextEditor.Label>
  <TextEditor.Toolbar />
  <TextEditor.Content />
</TextEditor.Root>
```

---

### FileTrigger
**Import:** `import { FileTrigger } from '@/components/base/file-upload-trigger/file-upload-trigger'`

| Prop | Type | Default |
|------|------|---------|
| acceptedFileTypes | `string[]` | — |
| allowsMultiple | `boolean` | — |
| onSelect | `(files: FileList) => void` | — |

```tsx
<FileTrigger onSelect={handleFiles} acceptedFileTypes={["image/*"]}>
  <Button>Upload</Button>
</FileTrigger>
```

---

## Application Components

### Tabs
**Import:** `import { Tabs } from '@/components/application/tabs/tabs'`

**Compound:** `Tabs.List`, `Tabs.Item`, `Tabs.Panel`

| Prop (TabList) | Type | Default |
|------|------|---------|
| size | `"sm" \| "md"` | — |
| type | `"button-brand" \| "button-gray" \| "button-border" \| "button-minimal" \| "underline" \| "line"` | — |
| fullWidth | `boolean` | — |

```tsx
<Tabs>
  <Tabs.List type="underline" size="sm">
    <Tabs.Item id="overview" label="Overview" />
    <Tabs.Item id="details" label="Details" badge={3} />
  </Tabs.List>
  <Tabs.Panel id="overview">Overview content</Tabs.Panel>
  <Tabs.Panel id="details">Details content</Tabs.Panel>
</Tabs>
```

---

### Modal / Dialog
**Import:** `import { DialogTrigger, ModalOverlay, Modal, Dialog } from '@/components/application/modals/modal'`

```tsx
<DialogTrigger>
  <Button>Open Modal</Button>
  <ModalOverlay>
    <Modal>
      <Dialog>
        {({ close }) => (
          <div>
            <h2>Modal Title</h2>
            <p>Content</p>
            <Button onPress={close}>Close</Button>
          </div>
        )}
      </Dialog>
    </Modal>
  </ModalOverlay>
</DialogTrigger>
```

---

### Breadcrumbs
**Import:** `import { Breadcrumbs } from '@/components/application/breadcrumbs/breadcrumbs'`

**Compound:** `Breadcrumbs.Item`

| Prop | Type | Default |
|------|------|---------|
| divider | `"chevron" \| "slash"` | — |
| type | `"text" \| "text-line" \| "button"` | — |
| maxVisibleItems | `number` | — |

```tsx
<Breadcrumbs divider="chevron" type="text">
  <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/guests">Guests</Breadcrumbs.Item>
  <Breadcrumbs.Item>Details</Breadcrumbs.Item>
</Breadcrumbs>
```

---

### Table / TableCard
**Import:** `import { Table, TableCard } from '@/components/application/table/table'`

**Compound:** `Table.Header`, `Table.Head`, `Table.Body`, `Table.Row`, `Table.Cell`, `TableCard.Root`, `TableCard.Header`

| Prop | Type | Default |
|------|------|---------|
| size (Table) | `"sm" \| "md"` | — |
| title (TableCard.Header) | `string` | — |
| description | `string` | — |
| contentTrailing | `ReactNode` | — |

```tsx
<TableCard.Root>
  <TableCard.Header title="Guests" contentTrailing={<Button>Add</Button>} />
  <Table size="sm">
    <Table.Header>
      <Table.Head>Name</Table.Head>
      <Table.Head>Email</Table.Head>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Olivia Rhye</Table.Cell>
        <Table.Cell>olivia@example.com</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</TableCard.Root>
```

---

### Pagination
**Import:** `import { PaginationPageDefault, PaginationCardDefault } from '@/components/application/pagination/pagination'`

| Prop | Type | Default |
|------|------|---------|
| page | `number` | — |
| total | `number` | — |
| rounded | `boolean` | — |
| onPageChange | `(page: number) => void` | — |

```tsx
<PaginationPageDefault page={1} total={10} onPageChange={setPage} />
```

---

### EmptyState
**Import:** `import EmptyState from '@/components/application/empty-state/empty-state'`

| Prop | Type | Default |
|------|------|---------|
| title | `string` | — |
| description | `string` | — |
| primaryCtaLabel | `string` | — |
| secondaryCtaLabel | `string` | — |
| onPrimaryClick | `() => void` | — |
| showIllustration | `boolean` | — |

```tsx
<EmptyState title="No guests yet" description="Add your first guest" primaryCtaLabel="Add Guest" />
```

---

### DatePicker
**Import:** `import { DatePicker } from '@/components/application/date-picker/date-picker'`

| Prop | Type | Default |
|------|------|---------|
| onApply | `(value: DateValue) => void` | — |
| onCancel | `() => void` | — |
| autoApply | `boolean` | — |

---

### DateRangePicker
**Import:** `import { DateRangePicker } from '@/components/application/date-picker/date-range-picker'`

Includes preset ranges (today, last week, last month, etc.).

---

### FileUpload
**Import:** `import { FileUpload } from '@/components/application/file-upload/file-upload-base'`

**Compound:** `FileUpload.Root`, `FileUpload.DropZone`, `FileUpload.List`, `FileUpload.ListItemProgressBar`, `FileUpload.ListItemProgressFill`

```tsx
<FileUpload.Root>
  <FileUpload.DropZone hint="SVG, PNG, JPG (max 5MB)" onDropFiles={handleDrop} />
</FileUpload.Root>
```

---

### SlideoutMenu
**Import:** `import { SlideoutMenu } from '@/components/application/slideout-menus/slideout-menu'`

**Compound:** `SlideoutMenu.Trigger`, `SlideoutMenu.Content`, `SlideoutMenu.Header`, `SlideoutMenu.Footer`

```tsx
<SlideoutMenu>
  <SlideoutMenu.Trigger><Button>Open Panel</Button></SlideoutMenu.Trigger>
  <SlideoutMenu.Content>
    <SlideoutMenu.Header onClose={close}>Details</SlideoutMenu.Header>
    <div className="p-6">Content</div>
    <SlideoutMenu.Footer>
      <Button color="secondary">Cancel</Button>
      <Button>Save</Button>
    </SlideoutMenu.Footer>
  </SlideoutMenu.Content>
</SlideoutMenu>
```

---

### Carousel
**Import:** `import { Carousel } from '@/components/application/carousel/carousel-base'`

**Compound:** `Carousel.Root`, `Carousel.Content`, `Carousel.Item`, `Carousel.PrevTrigger`, `Carousel.NextTrigger`, `Carousel.IndicatorGroup`, `Carousel.Indicator`

---

### Notifications
**Import:** `import { IconNotification, AvatarNotification } from '@/components/application/notifications/notifications'`

| Prop | Type | Default |
|------|------|---------|
| title | `string` | — |
| description | `string` | — |
| color | `"default" \| "brand" \| "gray" \| "error" \| "warning" \| "success"` | — |
| onClose | `() => void` | — |

---

### TimePicker
**Import:** `import { TimePicker } from '@/components/application/time-picker/time-picker'`

| Prop | Type | Default |
|------|------|---------|
| variant | `"list" \| "columns"` | — |
| hour12 | `boolean` | — |
| timeInterval | `number` | — |
| placeholder | `string` | — |

---

### LoadingIndicator
**Import:** `import { LoadingIndicator } from '@/components/application/loading-indicator/loading-indicator'`

| Prop | Type | Default |
|------|------|---------|
| type | `"line-simple" \| "line-spinner" \| "dot-circle"` | — |
| size | `"sm" \| "md" \| "lg" \| "xl"` | — |
| label | `string` | — |

---

### AppHeader
**Import:** `import { AppHeader } from '@/components/application/app-header/app-header'`

---

### HeaderNavigation
**Import:** `import { HeaderNavigationBase } from '@/components/application/app-navigation/header-navigation'`

| Prop | Type | Default |
|------|------|---------|
| items | `NavItem[]` | required |
| subItems | `NavItem[]` | — |
| trailingContent | `ReactNode` | — |
| activeUrl | `string` | — |

**NavItem:** `{ label, href, current?, icon?, badge?, items? }`

---

## Foundation Components

### FeaturedIcon
**Import:** `import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'`

| Prop | Type | Default |
|------|------|---------|
| icon | `FC \| ReactNode` | required |
| size | `"sm" \| "md" \| "lg" \| "xl"` | — |
| color | `"brand" \| "gray" \| "error" \| "warning" \| "success"` | — |
| theme | `"light" \| "gradient" \| "dark" \| "outline" \| "modern" \| "modern-neue"` | — |

> `modern` and `modern-neue` themes only work with `color="gray"`.

```tsx
<FeaturedIcon icon={CheckCircle} color="success" theme="light" size="lg" />
```

---

### RatingStars
**Import:** `import { RatingStars } from '@/components/foundations/rating-stars'`

```tsx
<RatingStars rating={4.5} stars={5} />
```

---

### Dot
**Import:** `import { Dot } from '@/components/foundations/dot-icon'`

```tsx
<Dot size="md" />
```

---

## Icons

**Import:** `import { IconName } from '@untitledui/icons'`

Common icons:
- **Navigation:** `ChevronDown`, `ChevronRight`, `ChevronLeft`, `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`
- **Actions:** `Plus`, `Minus`, `X`, `Check`, `Edit03`, `Trash02`, `Copy01`, `Download01`, `Upload01`
- **UI:** `Search`, `Settings01`, `Settings02`, `Menu01`, `MoreHorizontal`, `MoreVertical`
- **Communication:** `Mail01`, `Phone01`, `MessageSquare01`
- **Files:** `File01`, `File02`, `Folder`, `Paperclip`
- **People:** `User01`, `Users01`, `UserPlus01`
- **Status:** `AlertCircle`, `AlertTriangle`, `CheckCircle`, `XCircle`, `InfoCircle`, `HelpCircle`
- **Business:** `Building07`, `CreditCard01`, `Calendar`, `Clock`, `Map01`, `Globe01`
- **Media:** `Image01`, `PlayCircle`, `Camera01`
- **Data:** `BarChart01`, `PieChart01`, `TrendUp01`, `TrendDown01`
- **Misc:** `Home01`, `Star01`, `Heart`, `Eye`, `EyeOff`, `Lock01`, `Link01`, `ExternalLink01`, `FilterLines`, `SortLines`

### Icon Usage
```tsx
// As component ref (preferred for component props)
<Button iconLeading={ChevronDown}>Options</Button>

// Standalone
<Search className="size-5 text-fg-quaternary" />

// As JSX element (must include data-icon)
<Button iconLeading={<ChevronDown data-icon className="size-4" />}>Options</Button>
```
