"use client"
import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const SideNav = () => {
    const MenuOption = [
        {
            id: 1,
            name: "DashBoard",
            path: "/dashboard",
            icon: PanelsTopLeft
        },
        {
            id: 2,
            name: "Create New",
            path: "/dashboard/create-new",
            icon: FileVideo
        },
        {
            id: 3,
            name: "Upgrade",
            path: "/dashboard/upgrade",
            icon: ShieldPlus
        },
        {
            id: 4,
            name: "Account",
            path: "/dashboard/account",
            icon: CircleUser
        },
    ]
    const pathname=usePathname();
    console.log(pathname)
    return (
        <div className="w-64 h-screen shadow-md p-5">
            <div className="grid gap-3">
                {
                    MenuOption.map((option, index) => (
                        <Link href={option.path} key={index}>
                            <div className={`flex items-center gap-3 p-3 hover:bg-primary hover:text-white hover:cursor-pointer rounded-md ${pathname==option.path&&'bg-primary text-white'}`}>
                                <option.icon />
                                <h2>{option.name}</h2>
                            </div>
                        </Link>
                    ))

                }
            </div>
        </div>
    )
}

export default SideNav
