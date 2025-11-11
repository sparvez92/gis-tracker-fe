'use client';
import { Column, DataTable } from '@/components/custom/dataTable';
import FilterHeader from '@/components/custom/Filters';
import Title from '@/components/custom/Title';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { COLUMNS, DUMMY_DATA } from '@/constants';
import { cn } from '@/lib/utils';
import { Badge, Download, Edit, Trash2 } from 'lucide-react';



const AddProject = () => {
  return (
    <div className="px-8 py-14">
      <Title>General Settings</Title>

      <FilterHeader />

      <div className="w-full max-w-[100vw] overflow-hidden">
        <DataTable columns={COLUMNS} data={DUMMY_DATA} showPagination />
      </div>
    </div>
  );
};

export default AddProject;
