import { SearchIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiConversation } from "react-icons/gi";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import { useSocket } from "../context/SocketContext";
import useShowToast from "../hooks/useShowToast";


const ChatPage = () => {
	const [searchingUser, setSearchingUser] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const [allUsers, setAllUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [searchSuggestions, setSearchSuggestions] = useState([]);
	const { socket, onlineUsers } = useSocket();


	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				// console.log(data);
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

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
		getConversations();
	}, [showToast, setConversations]);

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

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		// if (username) setSearchText(username);

		if (searchText === "") {
			setSearchingUser(false);
			return;
		}

		try {
			// console.log('this should execute after');
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "1000px" }}
			p={4}
			transform={"translateX(-50%)"}
		>
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx={"auto"}
			>
				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={handleInputChange} />
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					<div>Suggestions</div>
					{searchSuggestions.length > 0 ?
						<Flex direction={"column"} gap={4} padding={'10px'}>
							{searchSuggestions.map((user) => <>
								<Flex gap={2} key={user._id}>
									<Avatar src={user.profilePic} />
									<Box>
										<Text fontSize={"sm"} fontWeight={"bold"}>
											{user.username}
										</Text>
										<Text color={"gray.light"} fontSize={"sm"}>
											{user.name}
										</Text>
									</Box>
								</Flex >
							</>)}
						</Flex>
						: <></>
					}

					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

					<div>Chats</div>
					{!loadingConversations &&
						conversations.map((conversation) => (
							<Conversation
								key={conversation._id}
								isOnline={onlineUsers.includes(conversation.participants[0]._id)}
								conversation={conversation}
							/>
						))}
				</Flex>

				{!selectedConversation._id && (
					<Flex
						flex={70}
						borderRadius={"md"}
						p={2}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}

				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box >
	);
};

export default ChatPage;