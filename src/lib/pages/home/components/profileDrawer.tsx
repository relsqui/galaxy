import {
  Avatar,
  createOverlay,
  Drawer,
  Portal,
  Editable,
  CreateOverlayProps,
} from '@chakra-ui/react';
import { Person } from './interfaces';
import { useAuthedPerson } from '../hooks/useAuthedPerson';


export const profileDrawer = createOverlay<{ person: Person }>((props) => {
  const [authedPerson, updateAuthedPerson] = useAuthedPerson();
  const person = props.person;
  const rootProps: CreateOverlayProps = props;

  const updatePerson = async (field: keyof Person, e: Editable.ValueChangeDetails) => {
    if (e.value.length < 1 || person.id != authedPerson?.id) return;
    console.log(e)
    await updateAuthedPerson({ [field]: e.value });
  }

  return (
    <Drawer.Root {...rootProps}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title asChild>
                <Editable.Root
                  value={person.display_name}
                  onValueCommit={(e) => updatePerson("display_name", e)}
                  activationMode="click"
                  disabled={person.id != authedPerson?.id}
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Avatar.Root shape="rounded" size="2xl">
                <Avatar.Fallback name={person.display_name} />
              </Avatar.Root>
              <Drawer.Description asChild>
                <Editable.Root
                  value={person.description}
                  onValueCommit={(e) => updatePerson("description", e)}
                  disabled={person.id != authedPerson?.id}
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
