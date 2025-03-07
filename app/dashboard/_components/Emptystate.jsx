import { Button } from '../../../components/ui/button'
import Link from 'next/link'
import React from 'react'

const Emptystate = () => {
    return (
        <div className="p-5 py-24 flex items-center flex-col mt-10 border-2 border-dashed">
            <h2 className="">You don't have any short videos</h2>
            <Link href={'/dashboard/create-new'}>
                <Button>Create New</Button>
            </Link>
        </div>
    )
}

export default Emptystate
