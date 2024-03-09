import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import useShowToast from "../hooks/useShowToast";

const UserPage = () => {

    const [user, setUser] = useState(null);
    const { username } = useParams();
    const showToast = useShowToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error, "error");
            }
        };

        getUser();
    }, [username, showToast]);

    if (!user) return null;

    return (
        <>
			<UserHeader user={user} />
            <UserPost likes={1300} replies={500} postImg="/post1.png" postTitle="Let's talk about threads." />
            <UserPost likes={451} replies={70} postImg="/post2.png" postTitle="Have a good day" />
            <UserPost likes={785} replies={257} postImg="/post3.png" postTitle="This is my first thread" />
            <UserPost likes={2500} replies={950} postTitle="Hello..." />
        </>
    )
}

export default UserPage