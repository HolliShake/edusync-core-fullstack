<?php

namespace App\Providers;

use App\Repo\CampusRepo;
use App\Interface\IRepo\ICampusRepo;
use App\Service\CampusService;
use App\Interface\IService\ICampusService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repo
        $this->app->bind(ICampusRepo::class, CampusRepo::class);
        // Service
        $this->app->bind(ICampusService::class, CampusService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
