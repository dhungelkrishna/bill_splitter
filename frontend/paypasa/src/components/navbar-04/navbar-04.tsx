'use client'
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { FaUserAlt } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import Cookies from 'js-cookie'

// imported to handle DropdownMenu. 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";
import { api } from "@/utils/app";
import { handleLogout } from "../login-form";
import { useEffect, useState } from "react";
import CreateGroupForm from "@/app/dashboard/creategroup/page";
import JoinGroupForm from "../JoinGroupForm";
import { decodeJwt } from "@/utils/decode_jwt";


const Navbar04Page = () => {
  const router = useRouter(); // Initialize the router

  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openJoinGroupDialog, setOpenJoinGroupDialog] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>('');

  useEffect(() => {
    const token = Cookies.get('access_token');

    if (token) {
      const decodedToken = decodeJwt(token);
      if (decodedToken) {
        setUserEmail(decodedToken.email);
      }
    }
  }, []);


  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    router.push('/auth/login'); // Redirect to login page after logout
  };

  return (
    <>
      <div className="bg-muted m-0 p-0">
        <nav className="sticky top-0 mt-2 inset-x-2 h-16 bg-background border dark:border-slate-700/70 ">
          <div className="h-full flex items-center justify-between mx-auto px-4">
            <Logo />

            {/* Desktop Menu */}
            {/* <NavMenu className="hidden md:block" /> */}

            <div className="flex items-center gap-3">
              <div className="useremail">
                <span>{userEmail ? (
                  <h1>{userEmail}!</h1>
                ) : (
                  <p>Hello Guest</p>
                )}</span>
              </div>
              <DropdownMenu >
                <DropdownMenuTrigger>
                  <IoNotifications className="text-3xl mx-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Latest Group Activity</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Notify 1</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Notify 2</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Notify 3</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>


              <DropdownMenu >
                <DropdownMenuTrigger>
                  <FaUserAlt className="text-3xl mx-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Manage Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenJoinGroupDialog(true)} >Join Group</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem className="bg-red-800 text-white"
                    onClick={handleLogout}
                  > Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>


              {/* Mobile Menu */}
              <div className="md:hidden">
                <NavigationSheet />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Profile Dialog */}
      {/* // <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
  //   <DialogContent>
  //     <DialogHeader>
  //       <DialogTitle>Edit Profile</DialogTitle>
  //     </DialogHeader>
  //     <ProfileForm />
  //   </DialogContent>
  // </Dialog> */}

      {/* Join Group Dialog */}
      <Dialog open={openJoinGroupDialog} onOpenChange={setOpenJoinGroupDialog}>

        <DialogTitle>

        </DialogTitle>
        <DialogContent className="px-0">
          <JoinGroupForm />
        </DialogContent>
      </Dialog>
    </>


  );
};

export default Navbar04Page;
