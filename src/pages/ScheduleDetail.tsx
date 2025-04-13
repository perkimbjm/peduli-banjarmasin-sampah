import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}


interface Participant {
  id: string;
  user: {
    full_name: string;
    email: string;
  } | null;
  status: 'pending' | 'confirmed' | 'declined';
}

const ScheduleDetail = () => {
  const { id } = useParams<Record<string, string>>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [participantsList, setParticipantsList] = useState<Participant[]>([]);


  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get(`/schedules/${id}`);
        setSchedule(response.data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    const fetchParticipants = async () => {
      try {
        const response = await api.get(`/schedules/${id}/participants`);
        setParticipantsList(response.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchSchedule();
    fetchParticipants();
  }, [id]);

  if (!schedule) {
    return <div>Loading schedule...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{schedule.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <span>{new Date(schedule.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{schedule.time}</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{schedule.location}</span>
            </div>
            <p className="text-gray-700">{schedule.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            {participantsList.map((p) => (
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
            ))}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ScheduleDetail;
