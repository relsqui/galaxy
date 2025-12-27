import {
  Avatar,
  createOverlay,
  Drawer,
  Portal,
  Editable,
  Stack,
  Button,
} from '@chakra-ui/react';
import { Person } from '@/lib/pages/home/components/interfaces';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCurrentNeighbors, selectCurrentPerson } from '@/app/store/slices/currentSelectors';
import { updatePerson } from '@/app/store/slices/personSlice';


export const profileDrawer = createOverlay<{ person: Person }>(props => {
  const { person } = props;
  const authedPerson = useAppSelector(selectCurrentPerson);
  const disabled = person.id != authedPerson.id;
  const [formName, setFormName] = useState<string>(person.display_name);
  const [formDescription, setFormDescription] = useState<string>(person.description);
  const dispatch = useAppDispatch();

  const dispatchUpdatePerson = async (field: keyof Person, value: string) => {
    if (value.length < 1) return;
    dispatch(updatePerson({ id: person.id, [field]: value }));
  }

  return (
    <Drawer.Root {...props}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title asChild>
                <Editable.Root
                  value={formName}
                  onValueChange={(e) => setFormName(e.value)}
                  onValueCommit={() => dispatchUpdatePerson("display_name", formName)}
                  activationMode="click"
                  disabled={disabled}
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Avatar.Root shape="rounded" size="2xl">
                <Avatar.Fallback name={formName} />
              </Avatar.Root>
              <Drawer.Description asChild>
                <Editable.Root
                  value={formDescription}
                  onValueChange={(e) => setFormDescription(e.value)}
                  onValueCommit={() => dispatchUpdatePerson("description", formDescription)}
                  disabled={disabled}
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
              </Drawer.Description>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
});

export const People = () => {
  const people = useAppSelector(selectCurrentNeighbors);
  return (
    <Stack direction="row">
      {people.map((person) => (
        <Button
          size="xs"
          variant="surface"
          key={person.id}
          onClick={async () =>
            await profileDrawer.open("profileDrawer", { person })
          }
        >
          {person.display_name}
        </Button>
      ))
      }
    </Stack >
  )
}
