<?php

namespace Database\Seeders;

use App\Models\Requirement;
use App\Enum\RequirementTypeEnum;
use Illuminate\Database\Seeder;

class RequirementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $requirements = [
            // ADMISSION Requirements
            [
                'requirement_name' => 'High School Diploma or Equivalent',
                'description' => 'Official high school diploma or General Education Development (GED) certificate required for admission.',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Official Transcripts',
                'description' => 'Complete official transcripts from all previously attended educational institutions.',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'College Entrance Exam Results',
                'description' => 'Standardized test scores (SAT, ACT, or university-specific entrance examination).',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Letter of Recommendation',
                'description' => 'Two letters of recommendation from teachers, counselors, or professional references.',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => false,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Personal Statement Essay',
                'description' => 'Written personal statement or essay describing academic goals and motivations.',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Valid Government-Issued ID',
                'description' => 'Copy of valid government-issued identification (National ID, Passport, or Driver\'s License).',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Birth Certificate',
                'description' => 'Authenticated copy of birth certificate from the Philippine Statistics Authority (PSA).',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Medical Certificate',
                'description' => 'Recent medical certificate from a licensed physician certifying physical fitness.',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Passport-Size Photos',
                'description' => 'Recent passport-size photographs (2x2 inches, white background).',
                'requirement_type' => RequirementTypeEnum::ADMISSION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],

            // GRADUATION Requirements
            [
                'requirement_name' => 'Completion of All Required Credit Hours',
                'description' => 'Successfully complete all credit hours required by the degree program.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Minimum GPA Requirement',
                'description' => 'Maintain a minimum cumulative GPA of 2.0 or higher throughout the program.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Completion of Major Courses',
                'description' => 'Successfully complete all major-specific required courses with passing grades.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'General Education Requirements',
                'description' => 'Fulfill all general education course requirements across multiple disciplines.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Thesis or Capstone Project',
                'description' => 'Complete and successfully defend a thesis or capstone project as required by the program.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Clearance from All Departments',
                'description' => 'Obtain clearance from library, registrar, finance, and all relevant departments.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Exit Exam or Comprehensive Exam',
                'description' => 'Pass the comprehensive exit examination for the degree program.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Residency Requirement',
                'description' => 'Complete minimum residency requirements (typically the final year) at the university.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'No Outstanding Balance',
                'description' => 'Clear all outstanding financial obligations to the university.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Return of Borrowed Materials',
                'description' => 'Return all borrowed books, equipment, and materials to the library and laboratories.',
                'requirement_type' => RequirementTypeEnum::GRADUATION->value,
                'is_mandatory' => true,
                'is_active' => true
            ],

            // ENROLLMENT Requirements
            [
                'requirement_name' => 'Registration Form',
                'description' => 'Completed and signed course registration form for the current semester.',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Proof of Payment',
                'description' => 'Valid proof of tuition payment or approved payment plan arrangement.',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Previous Semester Grades',
                'description' => 'Official grades from the previous semester showing satisfactory academic standing.',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Adviser Approval',
                'description' => 'Academic adviser\'s signature approving the course load and schedule.',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'No Failing Grades in Prerequisites',
                'description' => 'Successful completion of all prerequisite courses for enrolled subjects.',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Good Academic Standing',
                'description' => 'Student must be in good academic standing (not on probation or suspended).',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Updated Student Information',
                'description' => 'Current and accurate contact information and emergency contacts on file.',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Health Insurance',
                'description' => 'Proof of valid health insurance coverage for the academic year.',
                'requirement_type' => RequirementTypeEnum::ENROLLMENT->value,
                'is_mandatory' => false,
                'is_active' => true
            ],

            // SCHOLARSHIP Requirements
            [
                'requirement_name' => 'High Academic Achievement',
                'description' => 'Minimum GPA of 3.5 or equivalent academic excellence as specified by the scholarship.',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Scholarship Application Form',
                'description' => 'Completed and signed scholarship application form with all required information.',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Letter of Intent',
                'description' => 'Written letter explaining why the student deserves the scholarship.',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Income Tax Return or Certificate of Indigency',
                'description' => 'Financial documents proving financial need (for need-based scholarships).',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => false,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Certificate of Good Moral Character',
                'description' => 'Character certificate from previous school or community leader.',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Awards and Recognition Certificates',
                'description' => 'Copies of academic awards, honors, and recognition certificates.',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => false,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Endorsement Letter',
                'description' => 'Letter of endorsement from a faculty member or department head.',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Community Service Record',
                'description' => 'Documentation of community service or extracurricular activities.',
                'requirement_type' => RequirementTypeEnum::SCHOLARSHIP->value,
                'is_mandatory' => false,
                'is_active' => true
            ],

            // TRANSFER Requirements
            [
                'requirement_name' => 'Official Transcripts from Previous Institution',
                'description' => 'Complete official transcripts from all previously attended colleges or universities.',
                'requirement_type' => RequirementTypeEnum::TRANSFER->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Transfer Credit Evaluation',
                'description' => 'Formal evaluation of transfer credits by the registrar\'s office.',
                'requirement_type' => RequirementTypeEnum::TRANSFER->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Honorable Dismissal',
                'description' => 'Certificate of honorable dismissal from the previous institution.',
                'requirement_type' => RequirementTypeEnum::TRANSFER->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Good Academic Standing Certificate',
                'description' => 'Proof of good academic standing from the previous institution.',
                'requirement_type' => RequirementTypeEnum::TRANSFER->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Course Syllabus or Curriculum',
                'description' => 'Course syllabi or curriculum description for credit evaluation purposes.',
                'requirement_type' => RequirementTypeEnum::TRANSFER->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Transfer Application Form',
                'description' => 'Completed transfer student application form with required documentation.',
                'requirement_type' => RequirementTypeEnum::TRANSFER->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Minimum Credits Completed',
                'description' => 'Completion of minimum number of credits at previous institution (typically 24-30 credits).',
                'requirement_type' => RequirementTypeEnum::TRANSFER->value,
                'is_mandatory' => true,
                'is_active' => true
            ],

            // GENERAL Requirements
            [
                'requirement_name' => 'Student ID Card',
                'description' => 'Valid university student identification card for campus access and services.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'University Email Account',
                'description' => 'Active university email account for official communications.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Student Handbook Acknowledgement',
                'description' => 'Signed acknowledgment of receiving and reading the student handbook.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Emergency Contact Information',
                'description' => 'Current emergency contact information including name, relationship, and phone number.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Privacy and Data Consent Form',
                'description' => 'Signed consent form for the collection and use of personal data.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Code of Conduct Agreement',
                'description' => 'Signed agreement to abide by the university\'s code of conduct and policies.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => true,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Vaccination Records',
                'description' => 'Updated vaccination records as required by health and safety policies.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => false,
                'is_active' => true
            ],
            [
                'requirement_name' => 'Campus Orientation Completion',
                'description' => 'Certificate of completion of mandatory campus orientation program.',
                'requirement_type' => RequirementTypeEnum::GENERAL->value,
                'is_mandatory' => true,
                'is_active' => true
            ]
        ];

        foreach ($requirements as $requirement) {
            Requirement::create($requirement);
        }
    }
}

