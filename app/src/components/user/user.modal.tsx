import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRoleEnum } from '@/enums/role-enum';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser, useUpdateUser } from '@rest/api';
import type { User } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const userSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must not exceed 255 characters'),
    email: z.string().email('Invalid email address'),
    role: z.enum([
      UserRoleEnum.ADMIN,
      UserRoleEnum.PROGRAM_CHAIR,
      UserRoleEnum.COLLEGE_DEAN,
      UserRoleEnum.SPECIALIZATION_CHAIR,
      UserRoleEnum.CAMPUS_SCHEDULER,
      UserRoleEnum.CAMPUS_REGISTRAR,
      UserRoleEnum.STUDENT,
      UserRoleEnum.FACULTY,
      UserRoleEnum.GUEST,
    ]),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  controller: ModalState<User>;
  onSubmit: (data: UserFormData) => void;
}

const roleOptions = [
  { label: 'Admin', value: UserRoleEnum.ADMIN },
  { label: 'Program Chair', value: UserRoleEnum.PROGRAM_CHAIR },
  { label: 'College Dean', value: UserRoleEnum.COLLEGE_DEAN },
  { label: 'Specialization Chair', value: UserRoleEnum.SPECIALIZATION_CHAIR },
  { label: 'Campus Scheduler', value: UserRoleEnum.CAMPUS_SCHEDULER },
  { label: 'Campus Registrar', value: UserRoleEnum.CAMPUS_REGISTRAR },
  { label: 'Student', value: UserRoleEnum.STUDENT },
  { label: 'Faculty', value: UserRoleEnum.FACULTY },
  { label: 'Guest', value: UserRoleEnum.GUEST },
];

export default function UserModal({ controller, onSubmit }: UserModalProps) {
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRoleEnum.GUEST,
      password: '',
      confirmPassword: '',
    },
  });

  const { mutateAsync: createUser, isPending } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const roleValue = watch('role');

  const onFormSubmit = async (data: UserFormData) => {
    try {
      if (isEdit) {
        await updateUser({
          id: controller.data?.id as number,
          data: data as unknown as User,
        });
      } else {
        await createUser({
          data: data as unknown as User,
        });
      }
      toast.success(`User ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} user`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
        email: '',
        role: UserRoleEnum.GUEST,
        password: '',
        confirmPassword: '',
      });
    }
    reset({
      name: controller.data.name,
      email: controller.data.email,
      role: controller.data.role,
      password: '',
      confirmPassword: '',
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal controller={controller} title={`${isEdit ? 'Edit' : 'Create'} User`} size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter user name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email address" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            options={roleOptions}
            placeholder="Select a role"
            value={roleValue}
            onValueChange={(value) => setValue('role', value as UserFormData['role'])}
          />
          {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password{' '}
            {isEdit && <span className="text-muted-foreground">(leave blank to keep current)</span>}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={isEdit ? 'Enter new password (optional)' : 'Enter password'}
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password{' '}
            {isEdit && <span className="text-muted-foreground">(leave blank to keep current)</span>}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={isEdit ? 'Confirm new password (optional)' : 'Confirm password'}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
