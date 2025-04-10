// Fix the TypeScript errors by properly typing the participants
// Specific fix needed for the types in this file - update import and typing
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Participant as ParticipantType, Schedule } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";

const ScheduleDetail = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [participantStatus, setParticipantStatus] =
    useState<ParticipantType["status"]>("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!scheduleId) {
      toast("Schedule ID not found", { type: "error" });
      return;
    }

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const { data: scheduleData, error: scheduleError } = await supabase
          .from("schedules")
          .select("*")
          .eq("id", scheduleId)
          .single();

        if (scheduleError) {
          throw scheduleError;
        }

        if (!scheduleData) {
          toast("Schedule not found", { type: "error" });
          return;
        }

        setSchedule(scheduleData);

        const { data: participantsData, error: participantsError } =
          await supabase
            .from("participants")
            .select(
              `
              *,
              user:user_id (
                full_name,
                email
              )
            `
            )
            .eq("schedule_id", scheduleId);

        if (participantsError) {
          throw participantsError;
        }

        setParticipants(participantsData as ParticipantType[]);
      } catch (error: any) {
        toast(error.message, { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  const handleStatusChange = (
    participantId: string,
    newStatus: ParticipantType["status"]
  ) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.id === participantId
          ? { ...participant, status: newStatus }
          : participant
      )
    );
  };

  const updateParticipantStatus = async (
    participantId: string,
    newStatus: ParticipantType["status"]
  ) => {
    try {
      const { error } = await supabase
        .from("participants")
        .update({ status: newStatus })
        .eq("id", participantId);

      if (error) {
        throw error;
      }

      toast("Participant status updated successfully!", { type: "success" });
    } catch (error: any) {
      toast(error.message, { type: "error" });
    }
  };

  const handleJoinSchedule = async () => {
    if (!scheduleId || !user) {
      toast("Schedule ID or user not found", { type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("participants")
        .insert([
          {
            schedule_id: scheduleId,
            user_id: user.id,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setParticipants((prevParticipants) => [...prevParticipants, data]);
      toast("Successfully joined the schedule!", { type: "success" });
    } catch (error: any) {
      toast(error.message, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddParticipant = async (email: string) => {
    setIsSubmitting(true);
    try {
      // Fetch user by email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userError) {
        throw userError;
      }

      if (!userData) {
        toast("User with this email not found", { type: "error" });
        return;
      }

      // Insert participant
      const { data: participantData, error: participantError } = await supabase
        .from("participants")
        .insert([
          {
            schedule_id: scheduleId,
            user_id: userData.id,
            status: participantStatus,
          },
        ])
        .select(
          `
          *,
          user:user_id (
            full_name,
            email
          )
        `
        )
        .single();

      if (participantError) {
        throw participantError;
      }

      setParticipants((prevParticipants) => [
        ...prevParticipants,
        participantData as ParticipantType,
      ]);
      toast("Participant added successfully!", { type: "success" });
    } catch (error: any) {
      toast(error.message, { type: "error" });
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  const isUserJoined = participants.some(
    (participant) => participant.user_id === user?.id
  );

  if (loading) {
    return <div>Loading schedule details...</div>;
  }

  if (!schedule) {
    return <div>Schedule not found.</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{schedule.title}</CardTitle>
            <CardDescription>{schedule.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Lokasi</Label>
                <p className="text-sm font-medium">{schedule.location}</p>
              </div>
              <div>
                <Label>Tanggal Mulai</Label>
                <p className="text-sm font-medium">
                  {format(new Date(schedule.start_date), "PPPP", { locale: id })}
                </p>
              </div>
              <div>
                <Label>Tanggal Selesai</Label>
                <p className="text-sm font-medium">
                  {format(new Date(schedule.end_date), "PPPP", { locale: id })}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <Label>Peserta</Label>
              <ul className="mt-2">
                {participants.map((participant) => (
                  <li
                    key={participant.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        {participant.user?.full_name ? (
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${participant.user.full_name}`}
                            alt={participant.user.full_name}
                          />
                        ) : (
                          <AvatarFallback>
                            {participant.user?.email
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">
                          {participant.user?.full_name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {participant.user?.email || "No Email"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          participant.status === "pending" && "bg-yellow-500",
                          participant.status === "confirmed" && "bg-green-500",
                          participant.status === "declined" && "bg-red-500"
                        )}
                      >
                        {participant.status}
                      </Badge>
                      {user?.id === schedule.created_by && (
                        <Select
                          value={participant.status}
                          onValueChange={(value) => {
                            handleStatusChange(participant.id, value as ParticipantType["status"]);
                            updateParticipantStatus(participant.id, value as ParticipantType["status"]);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={participant.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => navigate("/jadwal")}>
              Kembali
            </Button>
            {!isUserJoined ? (
              <Button onClick={handleJoinSchedule} disabled={isSubmitting}>
                Ikuti Jadwal
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                Sudah Bergabung
              </Button>
            )}
          </CardFooter>
        </Card>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Tambah Peserta</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Peserta</DialogTitle>
              <DialogDescription>
                Tambahkan peserta ke jadwal ini dengan memasukkan alamat email
                mereka.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="example@gmail.com"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select onValueChange={(value) => setParticipantStatus(value as ParticipantType["status"])}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" onClick={() => handleAddParticipant("test@gmail.com")} disabled={isSubmitting}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleDetail;
