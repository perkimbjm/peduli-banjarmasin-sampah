
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Schedule, Participant } from "@/types/supabase";

const ScheduleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<"pending" | "confirmed" | "declined" | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getParticipantList = () => {
    if (!participants) return [];
    
    return participants.map((p) => ({
      name: p.user?.full_name || "Unknown User",
      email: p.user?.email || "No email",
      status: p.status
    }));
  };

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      try {
        setIsLoading(true);
        
        const { data: scheduleData, error: scheduleError } = await supabase
          .from("waste_management_schedules")
          .select("*")
          .eq("id", id)
          .single();
          
        if (scheduleError) throw scheduleError;
        if (scheduleData) {
          setSchedule(scheduleData as Schedule);
        }
        
        const { data: participantsData, error: participantsError } = await supabase
          .from("schedule_participants")
          .select("*, user:profiles!schedule_participants_user_id_fkey(full_name, email)")
          .eq("schedule_id", id);
          
        if (participantsError) throw participantsError;
        if (participantsData) {
          const typedParticipants = participantsData.map(p => ({
            ...p,
            user: p.user && typeof p.user === 'object' ? {
              full_name: p.user.full_name || null,
              email: p.user.email || ''
            } : null
          })) as Participant[];
          
          setParticipants(typedParticipants);
          
          const currentUserParticipation = typedParticipants.find(
            (p) => p.user_id === user?.id
          );
          if (currentUserParticipation) {
            setUserStatus(currentUserParticipation.status as "pending" | "confirmed" | "declined");
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        toast({
          variant: "destructive",
          title: "Error fetching schedule details",
          description: "Could not load schedule information. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchScheduleDetails();
    }
  }, [id, user?.id, toast]);

  const handleParticipation = async (status: "confirmed" | "declined") => {
    try {
      if (!user?.id || !id) return;

      const userParticipation = participants.find((p) => p.user_id === user.id);
      
      if (userParticipation) {
        const { error } = await supabase
          .from("schedule_participants")
          .update({ status })
          .eq("id", userParticipation.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("schedule_participants")
          .insert({
            schedule_id: id,
            user_id: user.id,
            status
          });
          
        if (error) throw error;
      }
      
      setUserStatus(status);
      
      const updatedParticipants = [...participants];
      const existingIndex = updatedParticipants.findIndex((p) => p.user_id === user.id);
      
      if (existingIndex >= 0) {
        updatedParticipants[existingIndex].status = status;
      } else {
        const newParticipant = {
          id: crypto.randomUUID(),
          schedule_id: id,
          user_id: user.id,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Participant;
        
        updatedParticipants.push(newParticipant);
      }
      
      setParticipants(updatedParticipants);
      
      toast({
        title: status === "confirmed" ? "Berhasil bergabung!" : "Anda menolak jadwal ini",
        description: status === "confirmed" 
          ? "Anda berhasil bergabung dengan jadwal ini." 
          : "Anda menolak untuk bergabung dengan jadwal ini."
      });
    } catch (error) {
      console.error("Error updating participation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update your participation status. Please try again."
      });
    }
  };

  const getUserInitials = (name: string | undefined) => {
    if (!name) return "U";
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-peduli-600"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Jadwal tidak ditemukan</h2>
          <p className="text-gray-500">
            Jadwal yang anda cari tidak ditemukan atau telah dihapus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{schedule.title}</CardTitle>
                </div>
                <Badge 
                  className="bg-peduli-600 hover:bg-peduli-700"
                >
                  Jadwal Pengelolaan
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground mt-2">
                <Clock className="mr-2 h-4 w-4" />
                <div>
                  <span className="font-semibold">Waktu: </span>
                  {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                </div>
              </div>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="mr-2 h-4 w-4" />
                <div>
                  <span className="font-semibold">Lokasi: </span>
                  {schedule.location}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {schedule.description || "Tidak ada deskripsi tersedia."}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 justify-end w-full">
                {userStatus === null && (
                  <>
                    <Button variant="outline" onClick={() => handleParticipation("declined")}>
                      <XCircle className="mr-2 h-4 w-4" /> Tolak
                    </Button>
                    <Button onClick={() => handleParticipation("confirmed")}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Gabung
                    </Button>
                  </>
                )}
                {userStatus === "pending" && (
                  <>
                    <Button variant="outline" onClick={() => handleParticipation("declined")}>
                      <XCircle className="mr-2 h-4 w-4" /> Tolak
                    </Button>
                    <Button onClick={() => handleParticipation("confirmed")}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Konfirmasi
                    </Button>
                  </>
                )}
                {userStatus === "confirmed" && (
                  <Button variant="outline" onClick={() => handleParticipation("declined")}>
                    <XCircle className="mr-2 h-4 w-4" /> Batalkan Partisipasi
                  </Button>
                )}
                {userStatus === "declined" && (
                  <Button onClick={() => handleParticipation("confirmed")}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Gabung
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> Peserta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.length > 0 ? (
                  participants.map((p) => (
                    <Card key={p.id} className="mb-2">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{p.user?.full_name ?? "Unnamed User"}</p>
                          <p className="text-sm text-muted-foreground">{p.user?.email ?? "No email available"}</p>
                        </div>
                        <Badge variant={p.status === 'confirmed' ? 'default' : p.status === 'pending' ? 'outline' : 'destructive'}>
                          {p.status === 'confirmed' ? 'Confirmed' : p.status === 'pending' ? 'Pending' : 'Declined'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <User className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>Belum ada peserta</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
