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
            [
                'id' => 1,
                'name' => 'Philipp Andrew Roa Redondo',
                'email' => 'philippandrewroaredondo@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('test@password'),
                'remember_token' => Str::random(10),
                'role' => UserRoleEnum::ADMIN,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
