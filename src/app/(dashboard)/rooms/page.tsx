import { RoomList } from "@/components/dashboard/room-list";

export default function RoomsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
                <p className="text-muted-foreground">Oversee room availability and patient admissions.</p>
            </div>
            <RoomList />
        </div>
    );
}
