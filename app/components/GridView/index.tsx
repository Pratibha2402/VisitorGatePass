import CardView from "@/components/CardView";
import { SvgIconComponent } from "@mui/icons-material";
import { Divider, Icon } from "@/core-components";

export interface GridViewOption {
  id: string;
  name: string;
  link: string;
  icon: SvgIconComponent;
  sectionId: string;
}

export interface GridViewSection {
  id: string;
  title: string;
  icon: SvgIconComponent;
}

export default function GridView({
  options,
  sections,
}: {
  options: Array<GridViewOption>;
  sections: Array<GridViewSection>;
}) {
  return (
    <>
      {sections.map((section: any, index: number) => {
        const sectionOptions = options.filter(
          (option: any) => option.sectionId === section.id
        );
        return (
          <>
            {index !== 0 && <Divider />}
            <div key={section.id} className="flex flex-col gap-8">
              <div className="flex gap-2 text-xl font-semibold">
                {section.icon && <Icon component={section.icon} />}
                <span>{section.title}</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] flex-wrap justify-around gap-8">
                {sectionOptions.map((option: any) => (
                  <CardView
                    key={option.id}
                    title={option.name}
                    link={option.link}
                    icon={option.icon}
                  />
                ))}
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}
