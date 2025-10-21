#!/usr/bin/env python3
import argparse
import os
import sys
from pathlib import Path


def generate_repository(class_name: str, base_dir: str):
    """Generate a repository class based on GenericRepo template."""
    repo_dir = Path(base_dir) / "app" / "Repo"
    repo_file = repo_dir / f"{class_name}Repo.php"

    # Skip if file already exists
    if repo_file.exists():
        print(f"⊘ Skipped repository (already exists): {repo_file}")
        return

    repo_content = f"""<?php

namespace App\\Repo;

use App\\Interface\\IRepo\\I{class_name}Repo;
use App\\Models\\{class_name};

class {class_name}Repo extends GenericRepo implements I{class_name}Repo
{{
    public function __construct()
    {{
        parent::__construct({class_name}::class);
    }}

    /**
     * Define allowed filters for the query builder
     * @return array
     */
    protected function getAllowedFilters(): array
    {{
        return [
            // Add campus-specific filters here
            // Example: AllowedFilter::exact('status'),
            // Example: AllowedFilter::partial('name'),
        ];
    }}

    /**
     * Define allowed sorts for the query builder
     * @return array
     */
    protected function getAllowedSorts(): array
    {{
        return [
            'created_at',
            'updated_at',
            // Add other campus-specific sortable fields
        ];
    }}

    /**
     * Define allowed includes for the query builder
     * @return array
     */
    protected function getAllowedIncludes(): array
    {{
        return [
            // Add campus-specific relationships here
            // Example: 'departments', 'buildings', 'students'
        ];
    }}
}}
"""

    repo_dir.mkdir(parents=True, exist_ok=True)

    with open(repo_file, 'w') as f:
        f.write(repo_content)

    print(f"✓ Generated repository: {repo_file}")


def generate_repository_interface(class_name: str, base_dir: str):
    """Generate a repository interface based on IGenericRepo template."""
    interface_dir = Path(base_dir) / "app" / "Interface" / "IRepo"
    interface_file = interface_dir / f"I{class_name}Repo.php"

    # Skip if file already exists
    if interface_file.exists():
        print(f"⊘ Skipped repository interface (already exists): {interface_file}")
        return

    interface_content = f"""<?php

namespace App\\Interface\\IRepo;

interface I{class_name}Repo extends IGenericRepo
{{
    // Add custom repository methods here
}}
"""

    interface_dir.mkdir(parents=True, exist_ok=True)

    with open(interface_file, 'w') as f:
        f.write(interface_content)

    print(f"✓ Generated repository interface: {interface_file}")


def generate_service(class_name: str, base_dir: str):
    """Generate a service class based on GenericService template."""
    service_dir = Path(base_dir) / "app" / "Service"
    service_file = service_dir / f"{class_name}Service.php"

    # Skip if file already exists
    if service_file.exists():
        print(f"⊘ Skipped service (already exists): {service_file}")
        return

    service_content = f"""<?php

namespace App\\Service;

use App\\Interface\\IService\\I{class_name}Service;
use App\\Interface\\IRepo\\I{class_name}Repo;

class {class_name}Service extends GenericService implements I{class_name}Service
{{
    public function __construct(I{class_name}Repo ${class_name[0].lower() + class_name[1:]}Repository)
    {{
        parent::__construct(${class_name[0].lower() + class_name[1:]}Repository);
    }}
}}
"""

    service_dir.mkdir(parents=True, exist_ok=True)

    with open(service_file, 'w') as f:
        f.write(service_content)

    print(f"✓ Generated service: {service_file}")


def generate_service_interface(class_name: str, base_dir: str):
    """Generate a service interface based on IGenericService template."""
    interface_dir = Path(base_dir) / "app" / "Interface" / "IService"
    interface_file = interface_dir / f"I{class_name}Service.php"

    # Skip if file already exists
    if interface_file.exists():
        print(f"⊘ Skipped service interface (already exists): {interface_file}")
        return

    interface_content = f"""<?php

namespace App\\Interface\\IService;

interface I{class_name}Service extends IGenericService
{{
    // Add custom service methods here
}}
"""

    interface_dir.mkdir(parents=True, exist_ok=True)

    with open(interface_file, 'w') as f:
        f.write(interface_content)

    print(f"✓ Generated service interface: {interface_file}")


def generate_controller(class_name: str, base_dir: str):
    """Generate a controller class based on controller.api.stub template."""
    controller_dir = Path(base_dir) / "app" / "Http" / "Controllers"
    controller_file = controller_dir / f"{class_name}Controller.php"
    stub_file = Path(base_dir) / "stubs" / "controller.api.stub"

    # Skip if file already exists
    if controller_file.exists():
        print(f"⊘ Skipped controller (already exists): {controller_file}")
        return

    # Check if stub file exists
    if not stub_file.exists():
        print(f"✗ Warning: Stub file not found at {stub_file}", file=sys.stderr)
        print(f"  Skipping controller generation", file=sys.stderr)
        return

    # Read the stub file
    with open(stub_file, 'r') as f:
        controller_content = f.read()

    # Replace placeholders
    controller_content = controller_content.replace('{{ namespace }}', 'App\\Http\\Controllers')
    controller_content = controller_content.replace('{{ rootNamespace }}', 'App\\')
    controller_content = controller_content.replace('{{ class }}', class_name)

    controller_dir.mkdir(parents=True, exist_ok=True)

    with open(controller_file, 'w') as f:
        f.write(controller_content)

    print(f"✓ Generated controller: {controller_file}")


def main():
    parser = argparse.ArgumentParser(
        description='Generate Repository and Service classes based on a model class name.'
    )
    parser.add_argument(
        '--class',
        dest='class_name',
        required=True,
        help='The name of the model class (e.g., Course, Curriculum)'
    )
    parser.add_argument(
        '--base-dir',
        dest='base_dir',
        default='.',
        help='Base directory for the Laravel application (default: .)'
    )

    args = parser.parse_args()
    class_name = args.class_name
    base_dir = args.base_dir

    # Validate that the model exists
    model_file = Path(base_dir) / "app" / "Models" / f"{class_name}.php"
    if not model_file.exists():
        print(f"✗ Error: Model file not found at {model_file}", file=sys.stderr)
        print(f"  Please ensure the model {class_name} exists before generating repository and service.", file=sys.stderr)
        sys.exit(1)

    print(f"Generating repository, service, controller, and interfaces for: {class_name}")
    print(f"Base directory: {base_dir}")
    print("-" * 60)

    try:
        generate_repository_interface(class_name, base_dir)
        generate_repository(class_name, base_dir)
        generate_service_interface(class_name, base_dir)
        generate_service(class_name, base_dir)
        generate_controller(class_name, base_dir)
        print("-" * 60)
        print(f"✓ Generation complete for {class_name}")
    except Exception as e:
        print(f"✗ Error during generation: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
