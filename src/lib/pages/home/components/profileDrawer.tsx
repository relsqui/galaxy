"use client";

import {
  Avatar,
  createOverlay,
  Drawer,
  Portal,
  Editable,
} from "@chakra-ui/react";
import { Person } from "./interfaces";

interface profileDrawerProps {
  person: Person;
  authedPerson: Person | null;
  updateAuthedPerson: (newPerson?: Partial<Person>) => Promise<void>;
}

export const profileDrawer = createOverlay<profileDrawerProps>((props) => {
  const { person, authedPerson, updateAuthedPerson, ...overlayProps } = props;

  const updateName = async (e: Editable.ValueChangeDetails) => {
    if (e.value.length < 1 || person.id != authedPerson?.id) return;
    await updateAuthedPerson({ display_name: e.value });
  };

  const updateDescription = async (e: Editable.ValueChangeDetails) => {
    if (e.value.length < 1 || person.id != authedPerson?.id) return;
    await updateAuthedPerson({ description: e.value });
  };

  return (
    <Drawer.Root {...overlayProps}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>
                {/* TODO: how do I style the editable as the title? */}
                <Editable.Root
                  value={person.display_name}
                  onValueChange={updateName}
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
              {/* TODO: Same styling question here with the description. */}
              <Editable.Root
                value={person.description}
                onValueChange={updateDescription}
                disabled={person.id != authedPerson?.id}
              >
                <Editable.Preview />
                <Editable.Input />
              </Editable.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
});
