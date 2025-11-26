export type Ticket = {
  id: string;
  title: string;
  description: string;
};

export type List = {
  id: string;
  title: string;
  tickets: Ticket[];
};

export type ProjectDetail = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  lists: List[];
};


export const sampleProjectData =
{
  id: 'PJ1',
  name: 'Project 1',
  description: 'This is project 1',
  image_url: '',
  lists: [
    {
      id: 'L1',
      title: 'List 1',
      tickets: [
        {id: 'T1', title: 'Ticket 1', description: 'This is ticket 1'},
        {id: 'T2', title: 'Ticket 2', description: 'This is ticket 2'},
        {id: 'T3', title: 'Ticket 3', description: 'This is ticket 3'},
      ],
    },
    {
      id: 'L2',
      title: 'List 2',
      tickets: [
        {id: 'T4', title: 'Ticket 4', description: 'This is ticket 4'},
        {id: 'T5', title: 'Ticket 5', description: 'This is ticket 5'},
        {id: 'T6', title: 'Ticket 6', description: 'This is ticket 6'},
      ],
    },
    {
      id: 'L3',
      title: 'List 3',
      tickets: [
        {id: 'T7', title: 'Ticket 7', description: 'This is ticket 7'},
        {id: 'T8', title: 'Ticket 8', description: 'This is ticket 8'},
        {id: 'T9', title: 'Ticket 9', description: 'This is ticket 9'},
      ],
    },
    {
      id: 'L4',
      title: 'List 4',
      tickets: [],
    },
  ],
}