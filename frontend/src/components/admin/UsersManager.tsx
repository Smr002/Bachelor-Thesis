import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Trash,
  UserPlus,
  Check,
  X,
  Mail,
  Pencil,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock user data - in a real app, this would come from a database
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    status: "active",
    joined: "2023-04-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    status: "active",
    joined: "2023-05-22",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    status: "active",
    joined: "2023-03-10",
  },
  {
    id: 4,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "student",
    status: "inactive",
    joined: "2023-06-05",
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva@example.com",
    role: "student",
    status: "active",
    joined: "2023-07-12",
  },
];

export const UsersManager = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const id = Math.max(...users.map((u) => u.id)) + 1;
    const today = new Date().toISOString().split("T")[0];

    setUsers([
      ...users,
      {
        id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "active",
        joined: today,
      },
    ]);

    setNewUser({ name: "", email: "", role: "student", password: "" });
    setIsAddDialogOpen(false);

    toast({
      title: "User added",
      description: "The user has been successfully added.",
    });
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-leetcode-text-secondary">
                  ID
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Name
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Email
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Role
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Status
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Joined Date
                </TableHead>
                <TableHead className="text-leetcode-text-secondary">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-leetcode-bg-light">
                  <TableCell className="text-leetcode-text-primary">
                    {user.id}
                  </TableCell>
                  <TableCell className="text-leetcode-text-primary font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-leetcode-text-primary">
                    {user.email}
                  </TableCell>
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
                  <TableCell className="text-leetcode-text-primary">
                    {user.joined}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className={
                          user.status === "active"
                            ? "text-leetcode-red border-leetcode-red hover:bg-leetcode-red/10"
                            : "text-leetcode-green border-leetcode-green hover:bg-leetcode-green/10"
                        }
                      >
                        {user.status === "active" ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle Status</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-leetcode-red border-leetcode-red hover:bg-leetcode-red/10"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  setNewUser({ ...newUser, role: e.target.value })
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
        <DialogContent className="bg-leetcode-bg-medium border-leetcode-bg-light text-leetcode-text-primary">
          <DialogHeader>
            <DialogTitle className="text-leetcode-text-primary">
              Invite User
            </DialogTitle>
            <DialogDescription className="text-leetcode-text-secondary">
              Send an invitation email to join the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-email" className="text-right">
                Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="col-span-3 bg-leetcode-bg-dark border-leetcode-bg-light text-leetcode-text-primary"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
              className="border-leetcode-bg-light text-leetcode-text-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteUser}
              className="bg-leetcode-blue hover:bg-leetcode-blue/90"
            >
              <MailCheck className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
