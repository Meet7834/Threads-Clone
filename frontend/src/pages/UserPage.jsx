import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
    return (
        <>
            <UserHeader />
            <UserPost likes={1300} replies={500} postImg="/post1.png" postTitle="Let's talk about threads." />
            <UserPost likes={451} replies={70} postImg="/post2.png" postTitle="Have a good day" />
            <UserPost likes={785} replies={257} postImg="/post3.png" postTitle="This is my first thread" />
            <UserPost likes={2500} replies={950}  postTitle="Hello..." />
        </>
    )
}

export default UserPage