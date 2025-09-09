import { CollectionItem } from "../modele/CollectionItem";
import { DayDescriptif } from "../modele/livreur/day-descriptif";

export const languesOptions: CollectionItem[] = [
    {
        label: "Français",
        code: "FR"
    },
    {
        label: "Anglais",
        code: "EN"
    },
    {
        label: "Arabe",
        code: "AR"
    }
]

export const daysTest: DayDescriptif[] = [
    {
        id: 1,
        date: new Date(Date.UTC(2025, 7, 12)),
        disponibility: false,
        tasks: []
    },
    {
        id: 2,
        date: new Date(Date.UTC(2025, 7, 13)),
        disponibility: false,
        tasks: [{
            title: "test",
            startHour: "09:00",
            endHour: "12:00"
        }]
    },
    {
        id: 3,
        date: new Date(Date.UTC(2025, 7, 18)),
        disponibility: true,
        tasks: [{
            title: "test",
            startHour: "09:00",
            endHour: "12:00"
        },
        {
            title: "test",
            startHour: "09:00",
            endHour: "12:00"
        }
        ]
    },
    {
        id: 4,
        date: new Date(Date.UTC(2025, 7, 19)),
        disponibility: true,
        tasks: [{
            title: "test",
            startHour: "09:00",
            endHour: "12:00"
        }
        ]
    }
]