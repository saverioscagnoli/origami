import {
  CalendarIcon,
  CardStackIcon,
  MixerVerticalIcon,
  QuoteIcon
} from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";
import { useSettings } from "~/zustand/settings";

const FilterMenuItems: React.FC = () => {
  const [filter, setFilter] = useSettings(s => [s.filter, s.setFilter]);

  return (
    <Menubar.Sub>
      <Menubar.SubTrigger leftIcon={<MixerVerticalIcon />}>
        Filter by
      </Menubar.SubTrigger>
      <Menubar.SubContent>
        <Menubar.Sub>
          <Menubar.SubTrigger leftIcon={<QuoteIcon />} iconSpacing={10}>
            Name
          </Menubar.SubTrigger>
          <Menubar.SubContent>
            <Menubar.RadioGroup
              value={filter.kind === "name" ? filter.asc.toString() : ""}
              onValueChange={v => {
                setFilter({ kind: "name", asc: v === "true" });
              }}
            >
              <Menubar.RadioItem value="true">A-Z</Menubar.RadioItem>
              <Menubar.RadioItem value="false">Z-A</Menubar.RadioItem>
            </Menubar.RadioGroup>
          </Menubar.SubContent>
        </Menubar.Sub>
        <Menubar.Sub>
          <Menubar.SubTrigger leftIcon={<CardStackIcon />} iconSpacing={10}>
            Size
          </Menubar.SubTrigger>
          <Menubar.SubContent>
            <Menubar.RadioGroup
              value={filter.kind === "size" ? filter.asc.toString() : ""}
              onValueChange={v => {
                setFilter({ kind: "size", asc: v === "true" });
              }}
            >
              <Menubar.RadioItem value="true">Ascending</Menubar.RadioItem>
              <Menubar.RadioItem value="false">Descending</Menubar.RadioItem>
            </Menubar.RadioGroup>
          </Menubar.SubContent>
        </Menubar.Sub>
        <Menubar.Sub>
          <Menubar.SubTrigger leftIcon={<CalendarIcon />} iconSpacing={10}>
            Date
          </Menubar.SubTrigger>
          <Menubar.SubContent>
            <Menubar.RadioGroup
              value={filter.kind === "date" ? filter.asc.toString() : ""}
              onValueChange={v => {
                setFilter({ kind: "date", asc: v === "true" });
              }}
            >
              <Menubar.RadioItem value="true">Newest</Menubar.RadioItem>
              <Menubar.RadioItem value="false">Oldest</Menubar.RadioItem>
            </Menubar.RadioGroup>
          </Menubar.SubContent>
        </Menubar.Sub>
      </Menubar.SubContent>
    </Menubar.Sub>
  );
};

export { FilterMenuItems };
