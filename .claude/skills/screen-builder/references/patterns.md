# Screen Patterns

Common layout patterns for building screens. Use these as starting points and compose them together.

---

## Page Layouts

### Simple Content Page
Full-width page with centered content area.
```tsx
<div className="min-h-dvh bg-primary">
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    {/* Page header */}
    <div className="mb-6">
      <h1 className="text-display-xs font-semibold text-primary">Page Title</h1>
      <p className="mt-1 text-sm text-tertiary">Page description goes here.</p>
    </div>
    {/* Content */}
  </div>
</div>
```

### Page with Header Bar
Page header with title, description, and action buttons.
```tsx
<div className="min-h-dvh bg-primary">
  <div className="border-b border-secondary px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      <div>
        <h1 className="text-display-xs font-semibold text-primary">Page Title</h1>
        <p className="mt-1 text-sm text-tertiary">Description text</p>
      </div>
      <div className="flex items-center gap-3">
        <Button color="secondary" iconLeading={Download01}>Export</Button>
        <Button iconLeading={Plus}>Add New</Button>
      </div>
    </div>
  </div>
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</div>
```

### Page with Sidebar
Two-column layout with sidebar navigation.
```tsx
<div className="flex min-h-dvh">
  {/* Sidebar */}
  <aside className="w-64 shrink-0 border-r border-secondary bg-primary">
    <div className="p-4">
      {/* Sidebar content */}
    </div>
  </aside>
  {/* Main */}
  <main className="flex-1 bg-primary">
    <div className="px-6 py-6 lg:px-8">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Page with Tabs
Content organized by tabs.
```tsx
<div className="min-h-dvh bg-primary">
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <h1 className="text-display-xs font-semibold text-primary">Page Title</h1>
    <div className="mt-6">
      <Tabs>
        <Tabs.List type="underline" size="sm">
          <Tabs.Item id="tab1" label="Overview" />
          <Tabs.Item id="tab2" label="Details" badge={5} />
          <Tabs.Item id="tab3" label="Settings" />
        </Tabs.List>
        <Tabs.Panel id="tab1"><div className="py-6">{/* Tab content */}</div></Tabs.Panel>
        <Tabs.Panel id="tab2"><div className="py-6">{/* Tab content */}</div></Tabs.Panel>
        <Tabs.Panel id="tab3"><div className="py-6">{/* Tab content */}</div></Tabs.Panel>
      </Tabs>
    </div>
  </div>
</div>
```

---

## Data Display Patterns

### Table with Search and Filters
```tsx
{/* Filter bar */}
<div className="flex items-center justify-between gap-4 mb-4">
  <Input icon={Search} placeholder="Search..." className="max-w-sm" />
  <div className="flex items-center gap-3">
    <Select placeholder="Status" items={statusOptions}>
      {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
    </Select>
    <Button color="secondary" iconLeading={FilterLines}>Filters</Button>
  </div>
</div>

{/* Table */}
<TableCard.Root>
  <TableCard.Header
    title="Items"
    badge={<Badge color="brand" size="sm">100 items</Badge>}
    contentTrailing={<Button iconLeading={Plus}>Add</Button>}
  />
  <Table size="sm">
    <Table.Header>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Date</Table.Head>
      <Table.Head />
    </Table.Header>
    <Table.Body>
      {items.map(item => (
        <Table.Row key={item.id}>
          <Table.Cell>
            <AvatarLabelGroup size="sm" src={item.avatar} title={item.name} subtitle={item.email} />
          </Table.Cell>
          <Table.Cell><Badge color={item.statusColor}>{item.status}</Badge></Table.Cell>
          <Table.Cell><span className="text-sm text-tertiary">{item.date}</span></Table.Cell>
          <Table.Cell>
            <Dropdown.Root>
              <Dropdown.DotsButton />
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item icon={Edit03} label="Edit" />
                  <Dropdown.Item icon={Trash02} label="Delete" />
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.Root>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</TableCard.Root>
<PaginationPageDefault page={1} total={10} />
```

### Stats Cards Row
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {stats.map(stat => (
    <Card key={stat.label} className="p-6">
      <p className="text-sm font-medium text-tertiary">{stat.label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-display-xs font-semibold text-primary">{stat.value}</span>
        <BadgeWithIcon
          iconLeading={stat.trend === 'up' ? ArrowUp : ArrowDown}
          color={stat.trend === 'up' ? 'success' : 'error'}
          size="sm"
        >
          {stat.change}
        </BadgeWithIcon>
      </div>
    </Card>
  ))}
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {items.map(item => (
    <Card key={item.id} className="overflow-hidden">
      <img src={item.image} alt="" className="h-48 w-full object-cover" />
      <CardContent className="p-5">
        <h3 className="font-semibold text-primary">{item.title}</h3>
        <p className="mt-1 text-sm text-tertiary">{item.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <Badge color="brand" size="sm">{item.category}</Badge>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## Form Patterns

### Settings Form
```tsx
<div className="max-w-2xl">
  <div className="space-y-6">
    {/* Section */}
    <div className="border-b border-secondary pb-6">
      <h2 className="text-lg font-semibold text-primary">Section Title</h2>
      <p className="mt-1 text-sm text-tertiary">Section description.</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First name" placeholder="Olivia" />
        <Input label="Last name" placeholder="Rhye" />
      </div>
      <div className="mt-4">
        <Input label="Email" placeholder="olivia@example.com" icon={Mail01} />
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3">
      <Button color="secondary">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  </div>
</div>
```

### Create/Edit Form with Sections
```tsx
<div className="mx-auto max-w-3xl">
  <div className="mb-6">
    <Breadcrumbs divider="chevron" type="text">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item>Create</Breadcrumbs.Item>
    </Breadcrumbs>
    <h1 className="mt-4 text-display-xs font-semibold text-primary">Create Item</h1>
  </div>

  <Card className="divide-y divide-border-secondary">
    {/* Section 1 */}
    <div className="p-6">
      <h3 className="text-md font-semibold text-primary">Basic Info</h3>
      <div className="mt-4 space-y-4">
        <Input label="Name" placeholder="Enter name" isRequired />
        <TextArea label="Description" placeholder="Enter description" rows={3} />
        <Select label="Category" placeholder="Select category" items={categories}>
          {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
        </Select>
      </div>
    </div>
    {/* Section 2 */}
    <div className="p-6">
      <h3 className="text-md font-semibold text-primary">Additional Details</h3>
      <div className="mt-4 space-y-4">
        <DatePicker />
        <Toggle label="Published" hint="Make visible to everyone" />
      </div>
    </div>
  </Card>

  <div className="mt-6 flex justify-end gap-3">
    <Button color="secondary">Cancel</Button>
    <Button>Create</Button>
  </div>
</div>
```

---

## Detail/Profile Patterns

### Detail Page with Sidebar
```tsx
<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
    {/* Main content */}
    <div className="lg:col-span-2 space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-primary">Details</h2>
        {/* Detail content */}
      </Card>
    </div>
    {/* Sidebar */}
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-md font-semibold text-primary">Summary</h3>
        {/* Sidebar content */}
      </Card>
    </div>
  </div>
</div>
```

---

## Empty State Pattern
```tsx
<div className="flex min-h-[400px] items-center justify-center">
  <EmptyState
    title="No items found"
    description="Get started by creating your first item"
    primaryCtaLabel="Create Item"
    onPrimaryClick={() => {}}
    showIllustration
  />
</div>
```

---

## Modal Pattern
```tsx
<DialogTrigger>
  <Button>Open Modal</Button>
  <ModalOverlay>
    <Modal>
      <Dialog>
        {({ close }) => (
          <div className="p-6">
            <div className="mb-5">
              <FeaturedIcon icon={AlertCircle} color="warning" theme="light" size="lg" />
              <h2 className="mt-4 text-lg font-semibold text-primary">Confirm Action</h2>
              <p className="mt-1 text-sm text-tertiary">Are you sure you want to proceed?</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button color="secondary" onPress={close}>Cancel</Button>
              <Button>Confirm</Button>
            </div>
          </div>
        )}
      </Dialog>
    </Modal>
  </ModalOverlay>
</DialogTrigger>
```

---

## Spacing Guidelines

- **Page padding:** `px-4 sm:px-6 lg:px-8`
- **Max width:** `max-w-7xl` for full pages, `max-w-3xl` for forms, `max-w-2xl` for settings
- **Section gaps:** `space-y-6` or `gap-6`
- **Card padding:** `p-5` or `p-6`
- **Between heading and content:** `mt-4` or `mt-6`
- **Between page title and subtitle:** `mt-1`
- **Button gaps:** `gap-3`
- **Form field gaps:** `space-y-4` or `gap-4`
