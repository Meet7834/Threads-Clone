"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userValidation } from '@/lib/vaildations/user';
import * as z from 'zod';
import Image from 'next/image';
import { ChangeEvent } from 'react';

interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    };
    btnTitle: string;
}

const AccountProfile = ({ user, btnTitle}: Props) => {
    const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: '',
            name: '',
            username: '',
            bio: ''
        }
    });

    const handleImage = (e: ChangeEvent, fieldChange: (value: string) => void) => {
        e.preventDefault();
    }

    function onSubmit(values: z.infer<typeof userValidation>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10"
            >
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-from_image-label'>
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt="profile photo"
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-conatiner'
                                    />
                                ) : (
                                    <Image
                                        src="/assets/profile.svg"
                                        alt="profile photo"
                                        width={24}
                                        height={24}
                                        className='object-conatiner'
                                    />
                                )}
                            </FormLabel>

                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Upload a photo'
                                    className="account-form_image-input"
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
};

export default AccountProfile;