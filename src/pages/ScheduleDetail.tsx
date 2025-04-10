
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash, 
  ArrowLeft, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

type Schedule = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type Participant = {
  id: string;
  schedule_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "declined";
  created_at: string;
  user: {
    full_name: string | null;
    email: string;
  };
};

const ScheduleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const isManagerRole = userRole === "admin" || userRole === "leader" || userRole === "stakeholder";

  // Query to fetch schedule details
  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["schedule", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("waste_management_schedules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching schedule:", error);
        throw new Error("Failed to fetch schedule details");
      }

      return data as Schedule;
    },
    enabled: !!id,
  });

  // Query to fetch schedule participants
  const { data: participants = [], isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["schedule-participants", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("schedule_participants")
        .select(`
          *,
          user:user_id(
            full_name:profiles!inner(full_name),
            email:auth.users!inner(email)
          )
        `)
        .eq("schedule_id", id);

      if (error) {
        console.error("Error fetching participants:", error);
        throw new Error("Failed to fetch participants");
      }

      return data as unknown as Participant[];
    },
    enabled: !!id,
  });

  // Mutation to delete a schedule
  const deleteScheduleMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Schedule ID is required");

      const { error } = await supabase
        .from("waste_management_schedules")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting schedule:", error);
        throw new Error("Failed to delete schedule");
      }

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Jadwal berhasil dihapus",
        description: "Jadwal pengelolaan sampah telah dihapus dari sistem.",
      });
      navigate("/jadwal");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal menghapus jadwal",
        description: error.message,
      });
    },
  });

  // Mutation to join/leave a schedule
  const participateMutation = useMutation({
    mutationFn: async (action: "join" | "leave") => {
      if (!id || !user) throw new Error("User must be logged in");

      if (action === "join") {
        const { error } = await supabase
          .from("schedule_participants")
          .insert({
            schedule_id: id,
            user_id: user.id,
            status: "pending",
          });

        if (error) {
          console.error("Error joining schedule:", error);
          throw new Error("Failed to join schedule");
        }
      } else {
        // Leave schedule
        const { error } = await supabase
          .from("schedule_participants")
          .delete()
          .eq("schedule_id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("Error leaving schedule:", error);
          throw new Error("Failed to leave schedule");
        }
      }

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedule-participants", id] });
      
      toast({
        title: variables === "join" ? "Berhasil tergabung" : "Berhasil membatalkan",
        description: variables === "join" 
          ? "Anda telah bergabung dengan jadwal kegiatan pengelolaan sampah ini." 
          : "Anda telah membatalkan partisipasi dalam kegiatan ini.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal memproses permintaan",
        description: error.message,
      });
    },
  });

  // Check if current user is participating in this schedule
  const userParticipation = participants.find(
    (participant) => participant.user_id === user?.id
  );

  // Determine if the current date is past the schedule date
  const isPastEvent = schedule 
    ? new Date(schedule.end_date) < new Date() 
    : false;

  if (isLoadingSchedule) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 flex justify-center items-center min-h-[50vh]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!schedule) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Jadwal tidak ditemukan</h2>
            <p className="text-muted-foreground mb-6">
              Jadwal yang Anda cari tidak ada atau telah dihapus.
            </p>
            <Button onClick={() => navigate("/jadwal")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Jadwal
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/jadwal")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mr-2">
            Detail Jadwal Pengelolaan
          </h1>
          {isPastEvent ? (
            <Badge variant="outline" className="ml-2">Selesai</Badge>
          ) : (
            <Badge variant="outline" className="ml-2">Mendatang</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{schedule.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {schedule.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Tanggal: {format(new Date(schedule.start_date), "dd MMMM yyyy")}
                        {format(new Date(schedule.start_date), "dd MMMM yyyy") !==
                          format(new Date(schedule.end_date), "dd MMMM yyyy") &&
                          ` - ${format(new Date(schedule.end_date), "dd MMMM yyyy")}`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Waktu: {format(new Date(schedule.start_date), "HH:mm")} - {format(new Date(schedule.end_date), "HH:mm")}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Deskripsi Kegiatan</h3>
                    <p className="text-muted-foreground">
                      {schedule.description || "Tidak ada deskripsi untuk kegiatan ini."}
                    </p>
                  </div>

                  {(schedule.latitude && schedule.longitude) && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Koordinat Lokasi</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span>Lat: {schedule.latitude}</span>
                        <span>Lng: {schedule.longitude}</span>
                      </div>
                    </div>
                  )}

                  {isManagerRole && (
                    <>
                      <Separator />

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/jadwal/${id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="h-4 w-4 mr-2" />
                              Hapus
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteScheduleMutation.mutate()}
                                disabled={deleteScheduleMutation.isPending}
                              >
                                {deleteScheduleMutation.isPending ? "Menghapus..." : "Hapus"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              {!isPastEvent && !isManagerRole && (
                <CardFooter className="flex justify-end">
                  {userParticipation ? (
                    <Button
                      variant="outline"
                      onClick={() => participateMutation.mutate("leave")}
                      disabled={participateMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {participateMutation.isPending ? "Memproses..." : "Batalkan Partisipasi"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => participateMutation.mutate("join")}
                      disabled={participateMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {participateMutation.isPending ? "Memproses..." : "Berpartisipasi"}
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Peserta ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingParticipants ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : participants.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada peserta yang bergabung.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {participants.map((participant) => (
                      <li key={participant.id} className="flex justify-between items-center text-sm">
                        <span>{participant.user?.full_name || participant.user?.email || "Pengguna"}</span>
                        <Badge
                          variant={
                            participant.status === "confirmed"
                              ? "default"
                              : participant.status === "declined"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {participant.status === "confirmed"
                            ? "Hadir"
                            : participant.status === "declined"
                            ? "Tidak hadir"
                            : "Menunggu"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleDetail;
