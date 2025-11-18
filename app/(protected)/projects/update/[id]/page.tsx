import ProjectForm from '@/components/custom/forms/project';
import Section from '@/components/custom/Section';
import Title from '@/components/custom/Title';


const UpdateProject = () => {
  return (
    <div className="px-8 py-14">
      <Title>Edit Project</Title>

      <Section className="border-[0.3px] border-[#B9B9B9] mx-2 md:mx-7 mt-5 md:mt-12 rounded-[14px]">
        <div className="w-full max-w-[780px] mx-auto p-4 md:p-12">
          <ProjectForm isUpdate />
        </div>
      </Section>
    </div>
  );
};

export default UpdateProject;
