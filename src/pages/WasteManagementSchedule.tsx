import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Plus, Search, MapPin } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Schedule } from "@/types/supabase";

// Define our form schema using Zod
const scheduleFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

const WasteManagementSchedule = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Set up our form
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      latitude: undefined,
      longitude: undefined,
      start_date: undefined,
      end_date: undefined,
    },
  });

  // Query to fetch all schedules
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waste_management_schedules")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error fetching schedules:", error);
        throw new Error("Failed to fetch schedules");
      }

      return data as Schedule[];
    },
  });

  // Filter schedules based on search query
  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (schedule.description &&
        schedule.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Mutation to create a new schedule
  const createScheduleMutation = useMutation({
    mutationFn: async (values: ScheduleFormValues) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("waste_management_schedules")
        .insert({
          title: values.title,
          description: values.description || null,
          location: values.location,
          latitude: values.latitude || null,
          longitude: values.longitude || null,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
          created_by: user.id,
        })
        .select();

      if (error) {
        console.error("Error creating schedule:", error);
        throw new Error("Failed to create schedule");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate the schedules query to refetch data
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setIsFormOpen(false);
      form.reset();
      toast({
        title: "Schedule created",
        description: "The waste management schedule has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create schedule",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: ScheduleFormValues) => {
    createScheduleMutation.mutate(values);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jadwal Pengelolaan Sampah</h1>
            <p className="text-muted-foreground">
              Kelola dan atur jadwal kegiatan pengelolaan sampah di lingkungan Anda.
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" /> Tambah Jadwal
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari jadwal berdasarkan judul, lokasi, atau deskripsi..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? "Tidak ada jadwal yang sesuai dengan pencarian Anda."
                : "Belum ada jadwal yang dibuat. Klik tombol 'Tambah Jadwal' untuk membuat jadwal baru."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                onClick={() => navigate(`/jadwal/${schedule.id}`)}
              >
                <CardHeader>
                  <CardTitle>{schedule.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {schedule.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2 mb-4">
                    {schedule.description || "Tidak ada deskripsi"}
                  </p>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs">
                        Mulai:{" "}
                        {format(new Date(schedule.start_date), "dd MMM yyyy HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs">
                        Selesai:{" "}
                        {format(new Date(schedule.end_date), "dd MMM yyyy HH:mm")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Badge>Mendatang</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Tambah Jadwal Pengelolaan Sampah Baru</DialogTitle>
              <DialogDescription>
                Isi detail jadwal pengelolaan sampah yang akan dilaksanakan.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Kegiatan</FormLabel>
                      <FormControl>
                        <Input placeholder="Misalnya: Gotong Royong Pembersihan Sungai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan detail kegiatan yang akan dilaksanakan..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi</FormLabel>
                      <FormControl>
                        <Input placeholder="Misalnya: Taman Kota, Sungai Martapura, dll." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="-3.314494"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="114.590111"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal & Jam Mulai</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP HH:mm")
                                ) : (
                                  <span>Pilih tanggal & jam</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  const now = new Date();
                                  date.setHours(now.getHours());
                                  date.setMinutes(now.getMinutes());
                                  field.onChange(date);
                                }
                              }}
                              initialFocus
                            />
                            <div className="p-3 border-t border-border">
                              <Input
                                type="time"
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':');
                                  const date = field.value || new Date();
                                  date.setHours(parseInt(hours));
                                  date.setMinutes(parseInt(minutes));
                                  field.onChange(new Date(date));
                                }}
                                value={field.value ? format(field.value, "HH:mm") : ""}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal & Jam Selesai</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP HH:mm")
                                ) : (
                                  <span>Pilih tanggal & jam</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  // Set default end time to now + 2 hours
                                  const defaultEnd = new Date();
                                  defaultEnd.setHours(defaultEnd.getHours() + 2);
                                  date.setHours(defaultEnd.getHours());
                                  date.setMinutes(defaultEnd.getMinutes());
                                  field.onChange(date);
                                }
                              }}
                              initialFocus
                            />
                            <div className="p-3 border-t border-border">
                              <Input
                                type="time"
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':');
                                  const date = field.value || new Date();
                                  date.setHours(parseInt(hours));
                                  date.setMinutes(parseInt(minutes));
                                  field.onChange(new Date(date));
                                }}
                                value={field.value ? format(field.value, "HH:mm") : ""}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={createScheduleMutation.isPending}>
                    {createScheduleMutation.isPending ? "Menyimpan..." : "Simpan Jadwal"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default WasteManagementSchedule;
