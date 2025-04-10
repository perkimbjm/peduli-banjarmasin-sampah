
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Define schedule participant types
interface ScheduleParticipant {
  id: string;
  user_id: string;
  status: string;
  profiles?: {
    id: string;
    full_name?: string;
  };
}

interface Schedule {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  created_by: string;
  participants?: ScheduleParticipant[];
}

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const canManageSchedule = userRole === "admin" || userRole === "leader" || userRole === "stakeholder";

  // Fetch schedule details
  const { data: schedule, isLoading, isError } = useQuery({
    queryKey: ["schedule", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waste_management_schedules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Schedule;
    },
  });

  // Fetch participants
  const { data: participants } = useQuery({
    queryKey: ["participants", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule_participants")
        .select("*, profiles:user_id(id, full_name)")
        .eq("schedule_id", id);

      if (error) throw error;
      return data as ScheduleParticipant[];
    },
    enabled: !!id,
  });

  // Join schedule mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("schedule_participants")
        .insert([
          { 
            schedule_id: id, 
            user_id: user?.id,
            status: "confirmed"
          }
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants", id] });
      toast({
        title: "Berhasil bergabung",
        description: "Anda telah bergabung dengan jadwal pengelolaan sampah ini",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal bergabung",
        description: error.message,
      });
    }
  });

  // Leave schedule mutation
  const leaveMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("schedule_participants")
        .delete()
        .eq("schedule_id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants", id] });
      toast({
        title: "Berhasil keluar",
        description: "Anda telah keluar dari jadwal pengelolaan sampah ini",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal keluar",
        description: error.message,
      });
    }
  });

  const isParticipant = participants?.some(p => p.user_id === user?.id);
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: id });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-lg">Memuat data jadwal...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !schedule) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-xl font-bold mb-4">Jadwal tidak ditemukan</h1>
          <Button onClick={() => navigate("/jadwal")}>Kembali ke Daftar Jadwal</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="outline" onClick={() => navigate("/jadwal")} className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          {canManageSchedule && (
            <div className="flex gap-2">
              <Button variant="outline">Edit Jadwal</Button>
              <Button variant="destructive">Hapus</Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">{schedule.title}</CardTitle>
              <CardDescription>Detail jadwal pengelolaan sampah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-green-100 p-2 dark:bg-green-900">
                    <Calendar className="h-5 w-5 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Waktu Mulai</p>
                    <p className="font-medium">{formatDate(schedule.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
                    <Clock className="h-5 w-5 text-red-700 dark:text-red-300" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Waktu Selesai</p>
                    <p className="font-medium">{formatDate(schedule.end_date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900">
                    <MapPin className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Lokasi</p>
                    <p className="font-medium">{schedule.location}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Deskripsi Kegiatan</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {schedule.description || "Tidak ada deskripsi kegiatan"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              {isParticipant ? (
                <Button 
                  variant="destructive" 
                  onClick={() => leaveMutation.mutate()}
                  disabled={leaveMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {leaveMutation.isPending ? "Memproses..." : "Batalkan Keikutsertaan"}
                </Button>
              ) : (
                <Button 
                  onClick={() => joinMutation.mutate()}
                  disabled={joinMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {joinMutation.isPending ? "Memproses..." : "Bergabung dengan Kegiatan Ini"}
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Peserta ({participants?.length || 0})</span>
              </CardTitle>
              <CardDescription>Daftar peserta yang tergabung</CardDescription>
            </CardHeader>
            <CardContent>
              {participants && participants.length > 0 ? (
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="font-medium">
                        {participant.profiles?.full_name || "Nama tidak tersedia"}
                      </div>
                      <Badge variant={participant.status === "confirmed" ? "default" : "outline"}>
                        {participant.status === "confirmed" ? "Terkonfirmasi" : "Menunggu"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Belum ada peserta terdaftar
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleDetail;
