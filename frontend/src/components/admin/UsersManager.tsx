import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Trash,
  UserPlus,
  Check,
  X,
  Mail,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { createUser, getUsers } from "@/api";
import { CreateUserDto } from "@/types/user";
import { ClipLoader } from "react-spinners";
import { DecodedToken } from "@/types/user";
import { jwtDecode } from "jwt-decode";

export const UsersManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserDto>({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUsersFromApi = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decoded: DecodedToken = jwtDecode(token);
        console.log("Decoded role from token:", decoded.role);

        let data = await getUsers(token);

        if (decoded.role === "professor") {
          data = data.filter((user: any) => user.role !== "professor");
        }

        setUsers(data);
      } catch (error: any) {
        toast({
          title: "Error loading users",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsersFromApi();
  }, []);
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const created = await createUser(newUser);
      setUsers([...users, created]);
      setNewUser({ name: "", email: "", password: "", role: "student" });
      setIsAddDialogOpen(false);

      toast({
        title: "User added",
        description: "The user has been successfully created.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to add user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInviteUser = () => {
    if (!inviteEmail) {
      toast({
        title: "Missing email",
        description: "Please provide an email address.",
        variant: "destructive",
      });
      return;
    }

    setInviteEmail("");
    setIsInviteDialogOpen(false);

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}.`,
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    toast({
      title: "User removed",
      description: "The user has been successfully removed.",
    });
  };

  const handleToggleStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );

    const user = users.find((u) => u.id === id);
    const newStatus = user?.status === "active" ? "inactive" : "active";

    toast({
      title: "Status updated",
      description: `User status has been set to ${newStatus}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-leetcode-text-primary">
          Manage Users
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsInviteDialogOpen(true)}
            className="bg-leetcode-blue hover:bg-leetcode-blue/90"
          >
            <Mail className="h-4 w-4 mr-2" />
            Invite User
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-leetcode-green hover:bg-leetcode-green/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card className="bg-leetcode-bg-dark border-leetcode-bg-light overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center p-10">
              <ClipLoader color="#00BFFF" size={40} />
              <p className="text-leetcode-text-secondary mt-2">
                Loading users...
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === "active"
                            ? "bg-leetcode-green/20 text-leetcode-green"
                            : "bg-leetcode-red/20 text-leetcode-red"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>{user.joined || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.status === "active" ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary">
          <DialogHeader>
            <DialogTitle className="text-leetcode-text-primary">
              Add New User
            </DialogTitle>
            <DialogDescription className="text-leetcode-text-secondary">
              Create a new user account with the following details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="col-span-3 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="col-span-3 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value as "student" | "professor",
                  })
                }
                className="col-span-3 bg-leetcode-bg-dark border border-leetcode-bg-light rounded-md h-10 px-3 text-leetcode-text-primary"
              >
                <option value="student">Student</option>
                <option value="professor">Professor</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="pr-10 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-leetcode-text-secondary hover:text-leetcode-text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-leetcode-bg-light text-leetcode-text-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-leetcode-green hover:bg-leetcode-green/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation email to a user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-email" className="text-right">
                Email
              </Label>
              <Input
                id="invite-email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="col-span-3"
                placeholder="user@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleInviteUser}>
              <MailCheck className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
