<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enum\UserRoleEnum;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            // Admin User
            [
                'id' => 1,
                'name' => 'Philipp Andrew Roa Redondo',
                'email' => 'philippandrewroaredondo@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::ADMIN,
            ],

            // Program Chair User
            [
                'id' => 2,
                'name' => 'Dr. Maria Santos',
                'email' => 'maria.santos@programchair.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::PROGRAM_CHAIR,
            ],

            // Student Users
            [
                'id' => 3,
                'name' => 'Juan Dela Cruz',
                'email' => 'juan.delacruz@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
            [
                'id' => 4,
                'name' => 'Maria Clara Reyes',
                'email' => 'maria.reyes@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
            [
                'id' => 5,
                'name' => 'Pedro Santiago',
                'email' => 'pedro.santiago@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
            [
                'id' => 6,
                'name' => 'Ana Marie Gonzales',
                'email' => 'ana.gonzales@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
            [
                'id' => 7,
                'name' => 'Carlos Miguel Torres',
                'email' => 'carlos.torres@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
            [
                'id' => 8,
                'name' => 'Sofia Isabel Mendoza',
                'email' => 'sofia.mendoza@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
            [
                'id' => 9,
                'name' => 'Rafael Antonio Cruz',
                'email' => 'rafael.cruz@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
            [
                'id' => 10,
                'name' => 'Isabella Marie Garcia',
                'email' => 'isabella.garcia@student.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::STUDENT,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
