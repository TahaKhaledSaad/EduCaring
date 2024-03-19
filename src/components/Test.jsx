import axios from "axios";
import { useEffect, useState } from "react";
import { BASE } from "../Api";

function Test() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${BASE}/Event/UserBuyEvents`,
        {
          id: 0,
          userId: "128f307d-153a-4092-8df9-bdd2548b8970",
          totalPrice: 400,
          priceAfterDiscount: 300,
          discount: 100,
          discountCode: "kisjd98",
          isPaid: true,
          userEventDays: [
            {
              id: 0,
              eventDayId: 56,
              eventId: 60,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/plain",
          },
        }
      )
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(events);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
}

export default Test;
