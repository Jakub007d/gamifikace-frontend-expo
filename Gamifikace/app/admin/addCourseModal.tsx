import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";

export default function AddCourseModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [shortName, setShortName] = useState("");
  const [fullName, setFullName] = useState("");

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="rounded-2xl bg-white p-4">
        <ModalHeader>
          <Text className="text-lg font-semibold">Nový predmet</Text>
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <VStack className="gap-y-4">
              <Input>
                <InputField
                  value={shortName}
                  onChangeText={setShortName}
                  placeholder="Zkratka predmetu"
                />
              </Input>
              <Input>
                <InputField
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Názov predmetu"
                />
              </Input>
            </VStack>
          </FormControl>
        </ModalBody>
        <ModalFooter className="flex-row justify-end space-x-3">
          <Button variant="outline" onPress={onClose}>
            <ButtonText>Zrušiť</ButtonText>
          </Button>
          <Button
            onPress={() => {
              console.log("Uložené:", shortName, fullName);
              onClose();
            }}
          >
            <ButtonText>Uložiť</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
