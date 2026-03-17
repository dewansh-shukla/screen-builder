'use client'

import { useState } from 'react'
import { DotsHorizontal, Download01, FilterLines, Plus, SearchSm, UserPlus01 } from '@untitledui/icons'
import { Badge, BadgeWithDot } from '@/components/base/badges/badges'
import { Button } from '@/components/base/buttons/button'
import { CheckboxBase } from '@/components/base/checkbox/checkbox'
import { Input } from '@/components/base/input/input'
import { Avatar } from '@/components/base/avatar/avatar'
import { Table, TableCard } from '@/components/application/table/table'
import { PaginationPageDefault } from '@/components/application/pagination/pagination'
import { Dropdown } from '@/components/base/dropdown/dropdown'
import { PageWrapper } from '@/components/synced/PageWrapper'

const guests = [
    { id: '1', name: 'Olivia Rhye', email: 'olivia@untitledui.com', rsvp: 'confirmed', avatar: '', initials: 'OR', plusOnes: 2, table: 'Table 1' },
    { id: '2', name: 'Phoenix Baker', email: 'phoenix@untitledui.com', rsvp: 'confirmed', avatar: '', initials: 'PB', plusOnes: 1, table: 'Table 1' },
    { id: '3', name: 'Lana Steiner', email: 'lana@untitledui.com', rsvp: 'pending', avatar: '', initials: 'LS', plusOnes: 0, table: 'Unassigned' },
    { id: '4', name: 'Demi Wilkinson', email: 'demi@untitledui.com', rsvp: 'declined', avatar: '', initials: 'DW', plusOnes: 0, table: 'Table 3' },
    { id: '5', name: 'Candice Wu', email: 'candice@untitledui.com', rsvp: 'confirmed', avatar: '', initials: 'CW', plusOnes: 1, table: 'Table 2' },
    { id: '6', name: 'Natali Craig', email: 'natali@untitledui.com', rsvp: 'pending', avatar: '', initials: 'NC', plusOnes: 0, table: 'Unassigned' },
    { id: '7', name: 'Drew Cano', email: 'drew@untitledui.com', rsvp: 'confirmed', avatar: '', initials: 'DC', plusOnes: 3, table: 'Table 2' },
    { id: '8', name: 'Orlando Diggs', email: 'orlando@untitledui.com', rsvp: 'pending', avatar: '', initials: 'OD', plusOnes: 1, table: 'Table 4' },
]

const rsvpConfig: Record<string, { color: 'success' | 'warning' | 'error'; label: string }> = {
    confirmed: { color: 'success', label: 'Confirmed' },
    pending: { color: 'warning', label: 'Pending' },
    declined: { color: 'error', label: 'Declined' },
}

export default function GuestTable() {
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleAll = () => {
        if (selectedIds.size === filtered.length) setSelectedIds(new Set())
        else setSelectedIds(new Set(filtered.map((g) => g.id)))
    }

    const filtered = guests.filter(
        (g) =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const confirmedCount = guests.filter((g) => g.rsvp === 'confirmed').length
    const pendingCount = guests.filter((g) => g.rsvp === 'pending').length
    const declinedCount = guests.filter((g) => g.rsvp === 'declined').length

    return (
        <PageWrapper showHeader={true} showFooter={false} maxDesktopWidth="1440px">
            {/* Page header */}
            <div className="border-b border-secondary">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-display-xs font-semibold text-primary">Guest List</h1>
                        <p className="mt-1 text-sm text-tertiary">Manage your event guests and RSVPs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button color="secondary" iconLeading={Download01}>
                            Export
                        </Button>
                        <Button iconLeading={UserPlus01}>Add Guest</Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-secondary p-4">
                        <p className="text-sm font-medium text-tertiary">Confirmed</p>
                        <p className="mt-1 text-display-xs font-semibold text-success-primary">{confirmedCount}</p>
                    </div>
                    <div className="rounded-xl border border-secondary p-4">
                        <p className="text-sm font-medium text-tertiary">Pending</p>
                        <p className="mt-1 text-display-xs font-semibold text-warning-primary">{pendingCount}</p>
                    </div>
                    <div className="rounded-xl border border-secondary p-4">
                        <p className="text-sm font-medium text-tertiary">Declined</p>
                        <p className="mt-1 text-display-xs font-semibold text-error-primary">{declinedCount}</p>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="w-full max-w-sm">
                        <Input
                            icon={SearchSm}
                            placeholder="Search guests..."
                            value={searchQuery}
                            onChange={(v) => setSearchQuery(v)}
                        />
                    </div>
                    <Button color="secondary" iconLeading={FilterLines}>
                        Filters
                    </Button>
                </div>

                {/* Table */}
                <TableCard.Root>
                    <TableCard.Header
                        title="All Guests"
                        badge={<Badge color="brand" size="sm">{filtered.length} guests</Badge>}
                    />
                    <Table size="sm">
                        <Table.Header>
                            <Table.Head className="w-8">
                                <button onClick={toggleAll} className="flex items-center">
                                    <CheckboxBase
                                        size="sm"
                                        isSelected={selectedIds.size === filtered.length && filtered.length > 0}
                                        isIndeterminate={selectedIds.size > 0 && selectedIds.size < filtered.length}
                                    />
                                </button>
                            </Table.Head>
                            <Table.Head>Name</Table.Head>
                            <Table.Head>RSVP Status</Table.Head>
                            <Table.Head>Plus Ones</Table.Head>
                            <Table.Head>Table</Table.Head>
                            <Table.Head className="w-12" />
                        </Table.Header>
                        <Table.Body>
                            {filtered.map((guest) => {
                                const rsvp = rsvpConfig[guest.rsvp]
                                return (
                                    <Table.Row key={guest.id}>
                                        <Table.Cell>
                                            <button onClick={() => toggleSelect(guest.id)} className="flex items-center">
                                                <CheckboxBase size="sm" isSelected={selectedIds.has(guest.id)} />
                                            </button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm" initials={guest.initials} />
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{guest.name}</p>
                                                    <p className="text-sm text-tertiary">{guest.email}</p>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <BadgeWithDot color={rsvp.color} size="sm">
                                                {rsvp.label}
                                            </BadgeWithDot>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-tertiary">
                                                {guest.plusOnes > 0 ? `+${guest.plusOnes}` : '—'}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="text-sm text-tertiary">{guest.table}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Dropdown.Root>
                                                <button className="flex size-8 items-center justify-center rounded-md transition duration-100 ease-linear hover:bg-secondary">
                                                    <DotsHorizontal className="size-5 text-fg-quaternary" />
                                                </button>
                                                <Dropdown.Popover>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item label="Edit" />
                                                        <Dropdown.Item label="Send reminder" />
                                                        <Dropdown.Separator />
                                                        <Dropdown.Item label="Remove" />
                                                    </Dropdown.Menu>
                                                </Dropdown.Popover>
                                            </Dropdown.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </TableCard.Root>

                <div className="mt-4">
                    <PaginationPageDefault page={page} total={3} onPageChange={setPage} />
                </div>
            </div>
        </PageWrapper>
    )
}
