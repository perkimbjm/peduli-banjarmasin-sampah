
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Download, Search, Filter, User, UserPlus, Edit, Trash2, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Mock data for user roles distribution
const userRolesData = [
  { name: 'Admin', value: 8 },
  { name: 'Leader', value: 15 },
  { name: 'Stakeholder', value: 22 },
  { name: 'Volunteer', value: 120 },
];

// Mock data for user registrations
const userRegistrationsData = [
  { name: 'Jan', count: 18 },
  { name: 'Feb', count: 25 },
  { name: 'Mar', count: 30 },
  { name: 'Apr', count: 22 },
  { name: 'Mei', count: 28 },
  { name: 'Jun', count: 35 },
];

// Mock data for active users
const activeUsersData = [
  { name: 'Jan', count: 105 },
  { name: 'Feb', count: 120 },
  { name: 'Mar', count: 135 },
  { name: 'Apr', count: 145 },
  { name: 'Mei', count: 155 },
  { name: 'Jun', count: 165 },
];

interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  full_name?: string;
  is_active?: boolean;
  last_login_at?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UsersAdmin = () => {
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // In a real application, you would fetch users with their roles from Supabase
      // This is a mock implementation for UI demonstration
      // You'd need to adapt this to your Supabase schema and permissions
      
      const mockUsers: User[] = [
        {
          id: "1",
          email: "admin@example.com",
          created_at: "2025-01-15T08:30:00Z",
          role: "admin",
          full_name: "Admin User",
          is_active: true,
          last_login_at: "2025-04-10T09:30:00Z"
        },
        {
          id: "2",
          email: "leader@example.com",
          created_at: "2025-02-10T10:15:00Z",
          role: "leader",
          full_name: "Leader User",
          is_active: true,
          last_login_at: "2025-04-09T14:20:00Z"
        },
        {
          id: "3",
          email: "stakeholder@example.com",
          created_at: "2025-02-20T09:45:00Z",
          role: "stakeholder",
          full_name: "Stakeholder User",
          is_active: true,
          last_login_at: "2025-04-08T11:10:00Z"
        },
        {
          id: "4",
          email: "volunteer1@example.com",
          created_at: "2025-03-05T13:30:00Z",
          role: "volunteer",
          full_name: "Volunteer One",
          is_active: true,
          last_login_at: "2025-04-10T08:45:00Z"
        },
        {
          id: "5",
          email: "volunteer2@example.com",
          created_at: "2025-03-12T11:20:00Z",
          role: "volunteer",
          full_name: "Volunteer Two",
          is_active: false,
          last_login_at: "2025-03-15T16:30:00Z"
        },
        {
          id: "6",
          email: "volunteer3@example.com",
          created_at: "2025-04-02T15:45:00Z",
          role: "volunteer",
          full_name: null,
          is_active: true,
          last_login_at: "2025-04-09T10:15:00Z"
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Filter by role
    const roleMatch = selectedRole === "all" || user.role === selectedRole;
    
    // Filter by search query (email or name)
    const searchMatch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return roleMatch && searchMatch;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";
    
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      // In a real application, you would update the user role in Supabase
      // This is a mock implementation for UI demonstration
      
      // Update local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Success",
        description: `User role updated successfully to ${newRole}.`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // In a real application, you would update the user status in Supabase
      // This is a mock implementation for UI demonstration
      
      // Update local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ));
      
      toast({
        title: "Success",
        description: `User status updated successfully to ${!currentStatus ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground mt-2">
            Kelola pengguna, peran, dan izin untuk aplikasi PeduliSampah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users by Role Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Peran Pengguna</CardTitle>
              <CardDescription>Jumlah pengguna berdasarkan peran</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userRolesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRolesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Registrations Chart */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pendaftaran Pengguna Baru</CardTitle>
                <CardDescription>Tren pendaftaran 6 bulan terakhir</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Ekspor Data
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={userRegistrationsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Pendaftaran Baru" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Users List Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daftar Pengguna</CardTitle>
              <CardDescription>Kelola pengguna dan peran</CardDescription>
            </div>
            <Button className="bg-peduli-600 hover:bg-peduli-700 flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Tambah Pengguna
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex gap-2 flex-1">
                <Input 
                  placeholder="Cari berdasarkan email atau nama..." 
                  className="max-w-lg" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button>Cari</Button>
              </div>
              <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="stakeholder">Stakeholder</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Pengguna</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Peran</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Tanggal Registrasi</th>
                    <th className="text-left py-3 px-4">Login Terakhir</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin h-6 w-6 border-4 border-peduli-600 border-t-transparent rounded-full"></div>
                        </div>
                        <p className="mt-2 text-muted-foreground">Memuat data pengguna...</p>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center">
                        <p className="text-muted-foreground">Tidak ada pengguna ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const userInitials = (user.full_name || user.email).substring(0, 2).toUpperCase();
                      
                      return (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src="" alt={user.email} />
                                <AvatarFallback>{userInitials}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {user.full_name || "Unnamed User"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                user.role === "admin" ? "destructive" : 
                                user.role === "leader" || user.role === "stakeholder" ? "default" : "outline"
                              }
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {user.is_active ? (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span>Aktif</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                  <span>Tidak Aktif</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">{formatDate(user.created_at)}</td>
                          <td className="py-3 px-4">{formatDate(user.last_login_at)}</td>
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Edit className="h-4 w-4" /> Edit User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateRole(user.id, "admin")}
                                  disabled={user.role === "admin"}
                                >
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateRole(user.id, "leader")}
                                  disabled={user.role === "leader"}
                                >
                                  Make Leader
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateRole(user.id, "stakeholder")}
                                  disabled={user.role === "stakeholder"}
                                >
                                  Make Stakeholder
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateRole(user.id, "volunteer")}
                                  disabled={user.role === "volunteer"}
                                >
                                  Make Volunteer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleToggleStatus(user.id, !!user.is_active)}
                                  className="flex items-center gap-2"
                                >
                                  {user.is_active ? (
                                    <>
                                      <XCircle className="h-4 w-4" /> Deactivate User
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4" /> Activate User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                                  <Trash2 className="h-4 w-4" /> Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersAdmin;
