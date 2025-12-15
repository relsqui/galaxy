import {
  Avatar,
  createOverlay,
  Drawer,
  Portal,
  Editable,
} from '@chakra-ui/react';
import { Person } from './interfaces';
import { useState } from 'react';


export const profileDrawer = createOverlay<{
  person: Person,
  disabled: boolean,
  updateAuthedPerson: (newPerson?: Partial<Person>) => Promise<void>
}>((props) => {
  const { person, disabled, updateAuthedPerson } = props;
  const [formName, setFormName] = useState<string>(person.display_name);
  const [formDescription, setFormDescription] = useState<string>(person.description);

  const updatePerson = async (field: keyof Person, value: string) => {
    if (value.length < 1) return;
    await updateAuthedPerson({ [field]: value });
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
                  onValueCommit={() => updatePerson("display_name", formName)}
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
                  onValueCommit={() => updatePerson("description", formDescription)}
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
