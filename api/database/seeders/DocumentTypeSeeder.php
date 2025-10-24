<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Seeder;

class DocumentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documentTypes = [
            [
                'document_type_name' => 'Transcript of Records',
                'description' => 'Official academic transcript showing all courses taken and grades received throughout the student\'s academic career.'
            ],
            [
                'document_type_name' => 'Certificate of Grades',
                'description' => 'Official document showing the grades received by a student for a specific academic term or semester.'
            ],
            [
                'document_type_name' => 'Diploma',
                'description' => 'Official document certifying that a student has successfully completed a degree program.'
            ],
            [
                'document_type_name' => 'Certificate of Enrollment',
                'description' => 'Official document certifying that a student is currently enrolled in the institution for a specific academic period.'
            ],
            [
                'document_type_name' => 'Certificate of Registration',
                'description' => 'Official document certifying that a student has registered for specific courses in an academic term.'
            ],
            [
                'document_type_name' => 'Certificate of Good Moral Character',
                'description' => 'Official document attesting to the student\'s good conduct and moral standing during their stay in the institution.'
            ],
            [
                'document_type_name' => 'Certificate of Graduation',
                'description' => 'Official document certifying that a student has fulfilled all graduation requirements and has been conferred a degree.'
            ],
            [
                'document_type_name' => 'Certificate of Transfer Credentials',
                'description' => 'Official document certifying that a student\'s academic records are eligible for transfer to another institution.'
            ],
            [
                'document_type_name' => 'Honorable Dismissal',
                'description' => 'Official document certifying that a student is leaving the institution in good standing without any pending obligations.'
            ],
            [
                'document_type_name' => 'Certificate of Completion',
                'description' => 'Official document certifying that a student has completed a specific program, course, or training.'
            ],
            [
                'document_type_name' => 'Certificate of Units Earned',
                'description' => 'Official document showing the total number of academic units or credits earned by a student.'
            ],
            [
                'document_type_name' => 'Certificate of Academic Standing',
                'description' => 'Official document showing the student\'s current academic status (e.g., good standing, probation, dean\'s list).'
            ],
            [
                'document_type_name' => 'Certificate of Attendance',
                'description' => 'Official document certifying that a student has attended a specific course, program, or academic term.'
            ],
            [
                'document_type_name' => 'Clearance Certificate',
                'description' => 'Official document certifying that a student has no pending obligations with various university departments (library, finance, etc.).'
            ],
            [
                'document_type_name' => 'Certificate of Medium of Instruction',
                'description' => 'Official document certifying the language used for instruction in the student\'s academic program.'
            ],
            [
                'document_type_name' => 'Authentication/Red Ribbon',
                'description' => 'Official authentication or apostille service for documents to be used abroad, authenticated by appropriate government agencies.'
            ],
            [
                'document_type_name' => 'Student ID Card',
                'description' => 'Official student identification card for campus access and services.'
            ],
            [
                'document_type_name' => 'Course Prospectus',
                'description' => 'Official document containing detailed information about course offerings, curriculum, and program requirements.'
            ],
            [
                'document_type_name' => 'Certificate of Scholarship',
                'description' => 'Official document certifying that a student is a scholarship recipient and specifying the scholarship details.'
            ],
            [
                'document_type_name' => 'Certificate of Academic Awards',
                'description' => 'Official document certifying academic awards, honors, and recognitions received by the student.'
            ]
        ];

        foreach ($documentTypes as $documentType) {
            DocumentType::create($documentType);
        }
    }
}

