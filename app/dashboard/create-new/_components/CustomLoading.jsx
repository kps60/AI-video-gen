import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
} from "../../../../components/ui/alert-dialog"
import Image from 'next/image'
const CustomLoading = ({ loading }) => {
    return (
        <AlertDialog open={loading}>
            <AlertDialogContent className="bg-white">
                <div className="bg-white flex flex-col items-center my-10 justify-center">
                    <Image src={'/loading.gif'} alt='loading' height={100} width={100}/>
                    <h2>Generating your video... Do not Refresh</h2>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default CustomLoading
