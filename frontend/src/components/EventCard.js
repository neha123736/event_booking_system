import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const eventId = event.id || event.event_id;
    if (eventId) {
      navigate(`/event/${eventId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group flex flex-col">

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={
            event.image_url ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800"
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {event.category || "Event"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
          {event.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {event.description}
        </p>

        {/* Info */}
        <div className="mt-4 space-y-2 text-sm">

          <div className="flex items-center gap-2 text-blue-600">
            <Calendar size={16} />
            <span>{event.date_time}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <Users size={16} />
            <span>{event.available_seats || 0} seats left</span>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex items-center justify-between pt-4">

          <span className="text-xl font-bold text-gray-900">
            ₹{event.price}
          </span>

          <button
            onClick={handleNavigate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            View
          </button>

        </div>
      </div>
    </div>
  );
};

export default EventCard;