
// Need this for the layout
import { Avatar } from '@/components/catalyst/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownDivider,
  DropdownLabel
} from '@/components/catalyst/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/catalyst/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/catalyst/sidebar'
import { SidebarLayout } from '@/components/catalyst/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'
import { Heading, Subheading } from '@/components/catalyst/heading'
import { Divider } from '@/components/catalyst/divider'

// Hero Icons
import {
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'

// Functions 
import { Get_Bookings } from "@/utils/Get_Bookings.js"
import { useEffect, useState } from 'react'

export default function Dashboard() {
  // React State
  const [bookings, set_bookings] = useState([]);

  const users = [
    { handle: 'u1', name: 'John Doe', email: 'john@example.com', access: 'Admin' },
    { handle: 'u2', name: 'Jane Smith', email: 'jane@example.com', access: 'Editor' },
    { handle: 'u3', name: 'Bob Brown', email: 'bob@example.com', access: 'Viewer' },
  ];
  const stats = [
    {
      title: "Total revenue",
      value: "$2.6M",
      change: "+4.5%",
      changeType: "increase",
    },
    {
      title: "Average order value",
      value: "$455",
      change: "-0.5%",
      changeType: "decrease",
    },
    {
      title: "Tickets sold",
      value: "5,888",
      change: "+4.5%",
      changeType: "increase",
    },
    {
      title: "Pageviews",
      value: "823,067",
      change: "+21.2%",
      changeType: "increase",
    },
  ];

  // Use Effect 
  useEffect(() => {
    // Get Bookings 
    Get_Bookings().then((value) => {
      set_bookings(value.data); // this is an array of objects
    })
  }, []);

  return (
    // Sidebar Layout Here
    <SidebarLayout
      // Navbar
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/profile-photo.jpg" square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/share-feedback">
                  <LightBulbIcon />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      // Sidebar
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <Avatar src="/tailwind-logo.svg" />
                <SidebarLabel>Tailwind Labs</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/teams/1/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/teams/1">
                  <Avatar slot="icon" src="/tailwind-logo.svg" />
                  <DropdownLabel>Tailwind Labs</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/teams/2">
                  <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" />
                  <DropdownLabel>Workcation</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/teams/create">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <SidebarSection className="max-lg:hidden">
              <SidebarItem href="/search">
                <MagnifyingGlassIcon />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/inbox">
                <InboxIcon />
                <SidebarLabel>Inbox</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/">
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/events">
                <Square2StackIcon />
                <SidebarLabel>Events</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/orders">
                <TicketIcon />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/broadcasts">
                <MegaphoneIcon />
                <SidebarLabel>Broadcasts</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              <SidebarItem href="/events/1">Bear Hug: Live in Concert</SidebarItem>
              <SidebarItem href="/events/2">Viking People</SidebarItem>
              <SidebarItem href="/events/3">Six Fingers — DJ Set</SidebarItem>
              <SidebarItem href="/events/4">We All Look The Same</SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href="/support">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/changelog">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src="/profile-photo.jpg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">Erica</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/share-feedback">
                  <LightBulbIcon />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {/* Inside Content */}
      <div>
        {/* Overview */}
        <div className="mb-14">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <Subheading>Overview</Subheading>
            <Dropdown>
              <DropdownButton outline className="text-sm text-white border-zinc-700">
                Last quarter
                <ChevronDownIcon className="ml-1 size-4" />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem>Last week</DropdownItem>
                <DropdownItem>Last two weeks</DropdownItem>
                <DropdownItem>Last month</DropdownItem>
                <DropdownItem>Last quarter</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 sm:gap-x-6 xl:gap-x-12">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className={`rounded-lg py-6 ${
                  index === 0 ? 'lg:pl-0' : ''
                } ${index === stats.length - 1 ? 'lg:pr-0' : ''} bg-zinc-900 sm:bg-transparent`}
              >
                <Divider className="mb-10 lg:mb-8" />
                <h3 className="text-lg sm:text-sm font-light text-zinc-300">{stat.title}</h3>
                <p className="mt-2 sm:mt-4 text-4xl sm:text-3xl font-medium text-white">{stat.value}</p>
                <div className="mt-4 sm:mt-4 flex items-center space-x-2">
                  <span
                    className={`text-md sm:text-sm font-medium px-2 pt-1 pb-1 rounded-sm mr-1 ${
                      stat.changeType === 'increase'
                        ? 'bg-[color-mix(in_oklab,var(--color-lime-400)_10%,transparent)] text-lime-500'
                        : 'bg-[color-mix(in_oklab,var(--color-pink-400)_10%,transparent)] text-pink-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-md sm:text-sm text-zinc-500">from last week</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <Subheading className="mb-4">Recent orders</Subheading>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Service</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((book, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-light">{book.name}</TableCell>
                  <TableCell className="font-light">{book.date}</TableCell>
                  <TableCell className="text-zinc-500">{book.time}</TableCell>
                  <TableCell className="font-light">{book.service}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SidebarLayout>
  )
}