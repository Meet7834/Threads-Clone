import { Button, Flex, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const SearchBox = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [searchingUser, setSearchingUser] = useState(false);
    const [searchText, setSearchText] = useState("");
    const showToast = useShowToast();
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingUsers(true);

        const fetchAllUsers = async () => {
            try {
                const res = await fetch("/api/users/allusers");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                // console.log('users data', data);
                setAllUsers(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchAllUsers();
    }, []);

    const handleInputChange = (e) => {
        const searchText = e.target.value;
        setSearchText(searchText);

        if (searchText === "") {
            setSearchSuggestions([]);
            setSearchingUser(false);
            return;
        }

        const regex = new RegExp(`^${searchText}`, 'i');
        const filteredUsers = allUsers.filter(user => regex.test(user.username)).slice(0, 3);
        setSearchSuggestions(filteredUsers);
        // console.log(searchSuggestions);
    }

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

            // console.log(searchedUser);
            navigate(`/${searchedUser.username}`);

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSearchingUser(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSearch} >
                <Flex alignItems={"center"} gap={2}>
                    <Input placeholder='Search for a user' onChange={handleInputChange} />
                    <Button size={"sm"} onClick={handleSearch} isLoading={searchingUser}>
                        <SearchIcon />
                    </Button>
                </Flex>
            </form>

            {searchSuggestions.length > 0 ?
                <Flex direction={"column"} gap={4} padding={'10px'}>
                    {searchSuggestions.map((user) => <SuggestedUser key={user._id} user={user} />)}
                </Flex>
                : <></>
            }
        </>
    )
}

export default SearchBox