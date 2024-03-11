import { Button, Flex, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const SearchBox = () => {
    // const [allUsers, setAllUsers] = useState([]);
    // const [loadingUsers, setLoadingUsers] = useState(true);
	const [searchingUser, setSearchingUser] = useState(false);
    const [searchText, setSearchText] = useState("");
    const showToast = useShowToast();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const getAllUsers = async () => {
    //         try {
    //             const res = await fetch("/api/users/allusers");
    //             const data = await res.json();
    //             if (data.error) {
    //                 showToast("Error", data.error, "error");
    //                 return;
    //             }
    //             console.log('users data', data);
    //             setAllUsers(data);
    //         } catch (error) {
    //             showToast("Error", error.message, "error");
    //         } finally {
    //             setLoadingUsers(false);
    //         }
    //     };

    //     getAllUsers();
    // }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        if (searchText === "") {
            setSearchingUser(false);
            return;
        }

        try {
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();
            if (searchedUser.error) {
                showToast("Error", searchedUser.error, "error");
                return;
            }

            console.log(searchedUser);
            navigate(`/${searchedUser.username}`);
            
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSearchingUser(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSearch}>
                <Flex alignItems={"center"} gap={2}>
                    <Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
                    <Button size={"sm"} onClick={handleSearch} isLoading={searchingUser}>
                        <SearchIcon />
                    </Button>
                </Flex>
            </form>
        </>
    )
}

export default SearchBox