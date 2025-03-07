"use client"
import React,{ useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select"
import { Textarea } from '../../../../components/ui/textarea'

const SelectTopic = ({ onUserSelect }) => {
    const options = ['Custom Prompt', 'Random Ai Story', 'Scary Story', 'Historical Facts', 'Bed Time Story', 'Motivational', 'Fun Facts']
    const [selectedOption, setSelectedOption] = useState([])
    return (
        <div className="">
            <h2 className="font-bold text-2xl text-primary">Content</h2>
            <p className="text-gray-500">what is your topic of your video? </p>
            <Select onValueChange={(value) => {
                setSelectedOption(value);
                value != 'Custom Prompt' && onUserSelect('topic', value)
            }}
            >
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((item, index) => (
                        <SelectItem value={item} key={index}>{item}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {selectedOption == 'Custom Prompt' &&
                <Textarea
                    className="mt-3"
                    onChange={(e) => onUserSelect('topic', e.target.value)}
                    placeholder="Write a Prompt on which you want to generate the video">

                </Textarea>}
        </div>
    )
}

export default SelectTopic
