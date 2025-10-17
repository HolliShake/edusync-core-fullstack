<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Curriculum;
use App\Models\CurriculumDetail;
use Illuminate\Database\Seeder;

class CurriculumDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $curricula = Curriculum::all();
        
        // First, create all courses if they don't exist
        $this->createAllCourses();
        
        $courses = Course::all();

        // Define common courses that appear in most programs
        $commonCourses = [
            // General Education Courses
            ['code' => 'GE101', 'title' => 'Understanding the Self'],
            ['code' => 'GE102', 'title' => 'Readings in Philippine History'],
            ['code' => 'GE103', 'title' => 'The Contemporary World'],
            ['code' => 'GE104', 'title' => 'Mathematics in the Modern World'],
            ['code' => 'GE105', 'title' => 'Science, Technology and Society'],
            ['code' => 'GE106', 'title' => 'Art Appreciation'],
            ['code' => 'GE107', 'title' => 'Ethics'],
            ['code' => 'GE108', 'title' => 'Purposive Communication'],
            ['code' => 'GE109', 'title' => 'Filipino'],
            ['code' => 'GE110', 'title' => 'Physical Education 1'],
            ['code' => 'GE111', 'title' => 'Physical Education 2'],
            ['code' => 'GE112', 'title' => 'Physical Education 3'],
            ['code' => 'GE113', 'title' => 'Physical Education 4'],
            ['code' => 'GE114', 'title' => 'National Service Training Program 1'],
            ['code' => 'GE115', 'title' => 'National Service Training Program 2'],
        ];

        // Define program-specific courses
        $programCourses = [
            'BSCS' => [
                // 1st Year
                ['code' => 'CS101', 'title' => 'Introduction to Computer Science'],
                ['code' => 'CS102', 'title' => 'Computer Programming 1'],
                ['code' => 'CS103', 'title' => 'Computer Programming 2'],
                ['code' => 'CS104', 'title' => 'Discrete Mathematics'],
                ['code' => 'CS105', 'title' => 'Data Structures and Algorithms'],
                ['code' => 'CS106', 'title' => 'Computer Organization'],
                ['code' => 'CS107', 'title' => 'Database Management Systems'],
                ['code' => 'CS108', 'title' => 'Web Development'],
                
                // 2nd Year
                ['code' => 'CS201', 'title' => 'Object-Oriented Programming'],
                ['code' => 'CS202', 'title' => 'Software Engineering'],
                ['code' => 'CS203', 'title' => 'Computer Networks'],
                ['code' => 'CS204', 'title' => 'Operating Systems'],
                ['code' => 'CS205', 'title' => 'Analysis of Algorithms'],
                ['code' => 'CS206', 'title' => 'Human Computer Interaction'],
                ['code' => 'CS207', 'title' => 'Information Assurance and Security'],
                ['code' => 'CS208', 'title' => 'Mobile Application Development'],
                
                // 3rd Year
                ['code' => 'CS301', 'title' => 'Artificial Intelligence'],
                ['code' => 'CS302', 'title' => 'Machine Learning'],
                ['code' => 'CS303', 'title' => 'Computer Graphics'],
                ['code' => 'CS304', 'title' => 'Compiler Design'],
                ['code' => 'CS305', 'title' => 'Distributed Systems'],
                ['code' => 'CS306', 'title' => 'Advanced Database Systems'],
                ['code' => 'CS307', 'title' => 'Software Testing'],
                ['code' => 'CS308', 'title' => 'Project Management'],
                
                // 4th Year
                ['code' => 'CS401', 'title' => 'Capstone Project 1'],
                ['code' => 'CS402', 'title' => 'Capstone Project 2'],
                ['code' => 'CS403', 'title' => 'Thesis 1'],
                ['code' => 'CS404', 'title' => 'Thesis 2'],
                ['code' => 'CS405', 'title' => 'Internship'],
                ['code' => 'CS406', 'title' => 'Special Topics in Computer Science'],
            ],
            'BSIT' => [
                // 1st Year
                ['code' => 'IT101', 'title' => 'Introduction to Information Technology'],
                ['code' => 'IT102', 'title' => 'Computer Programming 1'],
                ['code' => 'IT103', 'title' => 'Computer Programming 2'],
                ['code' => 'IT104', 'title' => 'Database Management Systems'],
                ['code' => 'IT105', 'title' => 'Web Development'],
                ['code' => 'IT106', 'title' => 'Computer Networks'],
                ['code' => 'IT107', 'title' => 'System Analysis and Design'],
                ['code' => 'IT108', 'title' => 'IT Fundamentals'],
                
                // 2nd Year
                ['code' => 'IT201', 'title' => 'Object-Oriented Programming'],
                ['code' => 'IT202', 'title' => 'Software Engineering'],
                ['code' => 'IT203', 'title' => 'Network Administration'],
                ['code' => 'IT204', 'title' => 'Database Administration'],
                ['code' => 'IT205', 'title' => 'Web Application Development'],
                ['code' => 'IT206', 'title' => 'Mobile Application Development'],
                ['code' => 'IT207', 'title' => 'Information Security'],
                ['code' => 'IT208', 'title' => 'IT Project Management'],
                
                // 3rd Year
                ['code' => 'IT301', 'title' => 'Enterprise Systems'],
                ['code' => 'IT302', 'title' => 'Cloud Computing'],
                ['code' => 'IT303', 'title' => 'Data Analytics'],
                ['code' => 'IT304', 'title' => 'IT Service Management'],
                ['code' => 'IT305', 'title' => 'E-Commerce Systems'],
                ['code' => 'IT306', 'title' => 'Digital Marketing'],
                ['code' => 'IT307', 'title' => 'IT Governance'],
                ['code' => 'IT308', 'title' => 'Quality Assurance'],
                
                // 4th Year
                ['code' => 'IT401', 'title' => 'Capstone Project 1'],
                ['code' => 'IT402', 'title' => 'Capstone Project 2'],
                ['code' => 'IT403', 'title' => 'Thesis 1'],
                ['code' => 'IT404', 'title' => 'Thesis 2'],
                ['code' => 'IT405', 'title' => 'Internship'],
                ['code' => 'IT406', 'title' => 'Special Topics in IT'],
            ],
            'BSCY' => [
                // 1st Year
                ['code' => 'CY101', 'title' => 'Introduction to Cybersecurity'],
                ['code' => 'CY102', 'title' => 'Computer Programming 1'],
                ['code' => 'CY103', 'title' => 'Computer Programming 2'],
                ['code' => 'CY104', 'title' => 'Network Fundamentals'],
                ['code' => 'CY105', 'title' => 'Operating Systems Security'],
                ['code' => 'CY106', 'title' => 'Database Security'],
                ['code' => 'CY107', 'title' => 'Cryptography Fundamentals'],
                ['code' => 'CY108', 'title' => 'Ethical Hacking Basics'],
                
                // 2nd Year
                ['code' => 'CY201', 'title' => 'Network Security'],
                ['code' => 'CY202', 'title' => 'Web Application Security'],
                ['code' => 'CY203', 'title' => 'Malware Analysis'],
                ['code' => 'CY204', 'title' => 'Digital Forensics'],
                ['code' => 'CY205', 'title' => 'Penetration Testing'],
                ['code' => 'CY206', 'title' => 'Security Risk Assessment'],
                ['code' => 'CY207', 'title' => 'Incident Response'],
                ['code' => 'CY208', 'title' => 'Security Policies and Procedures'],
                
                // 3rd Year
                ['code' => 'CY301', 'title' => 'Advanced Cryptography'],
                ['code' => 'CY302', 'title' => 'Cloud Security'],
                ['code' => 'CY303', 'title' => 'Mobile Security'],
                ['code' => 'CY304', 'title' => 'IoT Security'],
                ['code' => 'CY305', 'title' => 'Security Architecture'],
                ['code' => 'CY306', 'title' => 'Compliance and Governance'],
                ['code' => 'CY307', 'title' => 'Threat Intelligence'],
                ['code' => 'CY308', 'title' => 'Security Operations Center'],
                
                // 4th Year
                ['code' => 'CY401', 'title' => 'Capstone Project 1'],
                ['code' => 'CY402', 'title' => 'Capstone Project 2'],
                ['code' => 'CY403', 'title' => 'Thesis 1'],
                ['code' => 'CY404', 'title' => 'Thesis 2'],
                ['code' => 'CY405', 'title' => 'Internship'],
                ['code' => 'CY406', 'title' => 'Special Topics in Cybersecurity'],
            ],
            'BSCE' => [
                // 1st Year
                ['code' => 'CE101', 'title' => 'Introduction to Civil Engineering'],
                ['code' => 'CE102', 'title' => 'Engineering Drawing'],
                ['code' => 'CE103', 'title' => 'Computer Aided Drafting'],
                ['code' => 'CE104', 'title' => 'Engineering Mechanics'],
                ['code' => 'CE105', 'title' => 'Engineering Materials'],
                ['code' => 'CE106', 'title' => 'Surveying 1'],
                ['code' => 'CE107', 'title' => 'Engineering Mathematics 1'],
                ['code' => 'CE108', 'title' => 'Engineering Physics'],
                
                // 2nd Year
                ['code' => 'CE201', 'title' => 'Mechanics of Deformable Bodies'],
                ['code' => 'CE202', 'title' => 'Surveying 2'],
                ['code' => 'CE203', 'title' => 'Engineering Mathematics 2'],
                ['code' => 'CE204', 'title' => 'Fluid Mechanics'],
                ['code' => 'CE205', 'title' => 'Engineering Economics'],
                ['code' => 'CE206', 'title' => 'Construction Materials and Testing'],
                ['code' => 'CE207', 'title' => 'Engineering Geology'],
                ['code' => 'CE208', 'title' => 'Computer Programming for Engineers'],
                
                // 3rd Year
                ['code' => 'CE301', 'title' => 'Structural Analysis 1'],
                ['code' => 'CE302', 'title' => 'Structural Analysis 2'],
                ['code' => 'CE303', 'title' => 'Concrete Design 1'],
                ['code' => 'CE304', 'title' => 'Steel Design 1'],
                ['code' => 'CE305', 'title' => 'Highway Engineering'],
                ['code' => 'CE306', 'title' => 'Hydraulics'],
                ['code' => 'CE307', 'title' => 'Soil Mechanics'],
                ['code' => 'CE308', 'title' => 'Construction Methods'],
                
                // 4th Year
                ['code' => 'CE401', 'title' => 'Concrete Design 2'],
                ['code' => 'CE402', 'title' => 'Steel Design 2'],
                ['code' => 'CE403', 'title' => 'Foundation Engineering'],
                ['code' => 'CE404', 'title' => 'Water Resources Engineering'],
                ['code' => 'CE405', 'title' => 'Capstone Project 1'],
                ['code' => 'CE406', 'title' => 'Capstone Project 2'],
                ['code' => 'CE407', 'title' => 'Thesis 1'],
                ['code' => 'CE408', 'title' => 'Thesis 2'],
            ],
            'BSBA-MKT' => [
                // 1st Year
                ['code' => 'MKT101', 'title' => 'Principles of Marketing'],
                ['code' => 'MKT102', 'title' => 'Business Mathematics'],
                ['code' => 'MKT103', 'title' => 'Business Communication'],
                ['code' => 'MKT104', 'title' => 'Principles of Management'],
                ['code' => 'MKT105', 'title' => 'Business Law'],
                ['code' => 'MKT106', 'title' => 'Microeconomics'],
                ['code' => 'MKT107', 'title' => 'Accounting Principles'],
                ['code' => 'MKT108', 'title' => 'Business Statistics'],
                
                // 2nd Year
                ['code' => 'MKT201', 'title' => 'Consumer Behavior'],
                ['code' => 'MKT202', 'title' => 'Marketing Research'],
                ['code' => 'MKT203', 'title' => 'Advertising and Promotion'],
                ['code' => 'MKT204', 'title' => 'Sales Management'],
                ['code' => 'MKT205', 'title' => 'Macroeconomics'],
                ['code' => 'MKT206', 'title' => 'Financial Management'],
                ['code' => 'MKT207', 'title' => 'Operations Management'],
                ['code' => 'MKT208', 'title' => 'Human Resource Management'],
                
                // 3rd Year
                ['code' => 'MKT301', 'title' => 'Digital Marketing'],
                ['code' => 'MKT302', 'title' => 'Brand Management'],
                ['code' => 'MKT303', 'title' => 'International Marketing'],
                ['code' => 'MKT304', 'title' => 'Retail Management'],
                ['code' => 'MKT305', 'title' => 'Marketing Strategy'],
                ['code' => 'MKT306', 'title' => 'E-Commerce'],
                ['code' => 'MKT307', 'title' => 'Customer Relationship Management'],
                ['code' => 'MKT308', 'title' => 'Marketing Analytics'],
                
                // 4th Year
                ['code' => 'MKT401', 'title' => 'Strategic Marketing'],
                ['code' => 'MKT402', 'title' => 'Marketing Management'],
                ['code' => 'MKT403', 'title' => 'Capstone Project 1'],
                ['code' => 'MKT404', 'title' => 'Capstone Project 2'],
                ['code' => 'MKT405', 'title' => 'Thesis 1'],
                ['code' => 'MKT406', 'title' => 'Thesis 2'],
                ['code' => 'MKT407', 'title' => 'Internship'],
                ['code' => 'MKT408', 'title' => 'Special Topics in Marketing'],
            ]
        ];

        foreach ($curricula as $curriculum) {
            $programShortName = $curriculum->academicProgram->short_name ?? 'BSCS';
            
            // Get courses for this program, fallback to BSCS if not found
            $coursesForProgram = $programCourses[$programShortName] ?? $programCourses['BSCS'];
            
            // Combine common courses with program-specific courses
            $allCourses = array_merge($commonCourses, $coursesForProgram);
            
            // Create curriculum details - each course appears only once per curriculum
            $courseCounter = 0;
            for ($year = 1; $year <= 4; $year++) {
                for ($term = 1; $term <= 2; $term++) {
                    // Select 6-8 courses per term
                    $coursesPerTerm = array_slice($allCourses, $courseCounter, 6);
                    $courseCounter += 6;
                    
                    // Stop if we've used all courses
                    if (empty($coursesPerTerm)) {
                        break 2;
                    }
                    
                    foreach ($coursesPerTerm as $courseData) {
                        // Find the course (should already exist from createAllCourses)
                        $course = $courses->where('course_code', $courseData['code'])->first();
                        
                        if ($course) {
                            // Check if this course is already in this curriculum (respect unique constraint)
                            $existingDetail = CurriculumDetail::where('curriculum_id', $curriculum->id)
                                ->where('course_id', $course->id)
                                ->first();
                                
                            if (!$existingDetail) {
                                // Create curriculum detail
                                CurriculumDetail::create([
                                    'curriculum_id' => $curriculum->id,
                                    'course_id' => $course->id,
                                    'year_order' => $year,
                                    'term_order' => $term,
                                    'term_alias' => $term == 1 ? '1st Semester' : '2nd Semester',
                                    'is_include_gwa' => rand(0, 1) == 1
                                ]);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Create all courses that will be used in curricula
     */
    private function createAllCourses(): void
    {
        // Define common courses that appear in most programs
        $commonCourses = [
            // General Education Courses
            ['code' => 'GE101', 'title' => 'Understanding the Self'],
            ['code' => 'GE102', 'title' => 'Readings in Philippine History'],
            ['code' => 'GE103', 'title' => 'The Contemporary World'],
            ['code' => 'GE104', 'title' => 'Mathematics in the Modern World'],
            ['code' => 'GE105', 'title' => 'Science, Technology and Society'],
            ['code' => 'GE106', 'title' => 'Art Appreciation'],
            ['code' => 'GE107', 'title' => 'Ethics'],
            ['code' => 'GE108', 'title' => 'Purposive Communication'],
            ['code' => 'GE109', 'title' => 'Filipino'],
            ['code' => 'GE110', 'title' => 'Physical Education 1'],
            ['code' => 'GE111', 'title' => 'Physical Education 2'],
            ['code' => 'GE112', 'title' => 'Physical Education 3'],
            ['code' => 'GE113', 'title' => 'Physical Education 4'],
            ['code' => 'GE114', 'title' => 'National Service Training Program 1'],
            ['code' => 'GE115', 'title' => 'National Service Training Program 2'],
        ];

        // Define program-specific courses
        $programCourses = [
            'BSCS' => [
                // 1st Year
                ['code' => 'CS101', 'title' => 'Introduction to Computer Science'],
                ['code' => 'CS102', 'title' => 'Computer Programming 1'],
                ['code' => 'CS103', 'title' => 'Computer Programming 2'],
                ['code' => 'CS104', 'title' => 'Discrete Mathematics'],
                ['code' => 'CS105', 'title' => 'Data Structures and Algorithms'],
                ['code' => 'CS106', 'title' => 'Computer Organization'],
                ['code' => 'CS107', 'title' => 'Database Management Systems'],
                ['code' => 'CS108', 'title' => 'Web Development'],
                
                // 2nd Year
                ['code' => 'CS201', 'title' => 'Object-Oriented Programming'],
                ['code' => 'CS202', 'title' => 'Software Engineering'],
                ['code' => 'CS203', 'title' => 'Computer Networks'],
                ['code' => 'CS204', 'title' => 'Operating Systems'],
                ['code' => 'CS205', 'title' => 'Analysis of Algorithms'],
                ['code' => 'CS206', 'title' => 'Human Computer Interaction'],
                ['code' => 'CS207', 'title' => 'Information Assurance and Security'],
                ['code' => 'CS208', 'title' => 'Mobile Application Development'],
                
                // 3rd Year
                ['code' => 'CS301', 'title' => 'Artificial Intelligence'],
                ['code' => 'CS302', 'title' => 'Machine Learning'],
                ['code' => 'CS303', 'title' => 'Computer Graphics'],
                ['code' => 'CS304', 'title' => 'Compiler Design'],
                ['code' => 'CS305', 'title' => 'Distributed Systems'],
                ['code' => 'CS306', 'title' => 'Advanced Database Systems'],
                ['code' => 'CS307', 'title' => 'Software Testing'],
                ['code' => 'CS308', 'title' => 'Project Management'],
                
                // 4th Year
                ['code' => 'CS401', 'title' => 'Capstone Project 1'],
                ['code' => 'CS402', 'title' => 'Capstone Project 2'],
                ['code' => 'CS403', 'title' => 'Thesis 1'],
                ['code' => 'CS404', 'title' => 'Thesis 2'],
                ['code' => 'CS405', 'title' => 'Internship'],
                ['code' => 'CS406', 'title' => 'Special Topics in Computer Science'],
            ],
            'BSIT' => [
                // 1st Year
                ['code' => 'IT101', 'title' => 'Introduction to Information Technology'],
                ['code' => 'IT102', 'title' => 'Computer Programming 1'],
                ['code' => 'IT103', 'title' => 'Computer Programming 2'],
                ['code' => 'IT104', 'title' => 'Database Management Systems'],
                ['code' => 'IT105', 'title' => 'Web Development'],
                ['code' => 'IT106', 'title' => 'Computer Networks'],
                ['code' => 'IT107', 'title' => 'System Analysis and Design'],
                ['code' => 'IT108', 'title' => 'IT Fundamentals'],
                
                // 2nd Year
                ['code' => 'IT201', 'title' => 'Object-Oriented Programming'],
                ['code' => 'IT202', 'title' => 'Software Engineering'],
                ['code' => 'IT203', 'title' => 'Network Administration'],
                ['code' => 'IT204', 'title' => 'Database Administration'],
                ['code' => 'IT205', 'title' => 'Web Application Development'],
                ['code' => 'IT206', 'title' => 'Mobile Application Development'],
                ['code' => 'IT207', 'title' => 'Information Security'],
                ['code' => 'IT208', 'title' => 'IT Project Management'],
                
                // 3rd Year
                ['code' => 'IT301', 'title' => 'Enterprise Systems'],
                ['code' => 'IT302', 'title' => 'Cloud Computing'],
                ['code' => 'IT303', 'title' => 'Data Analytics'],
                ['code' => 'IT304', 'title' => 'IT Service Management'],
                ['code' => 'IT305', 'title' => 'E-Commerce Systems'],
                ['code' => 'IT306', 'title' => 'Digital Marketing'],
                ['code' => 'IT307', 'title' => 'IT Governance'],
                ['code' => 'IT308', 'title' => 'Quality Assurance'],
                
                // 4th Year
                ['code' => 'IT401', 'title' => 'Capstone Project 1'],
                ['code' => 'IT402', 'title' => 'Capstone Project 2'],
                ['code' => 'IT403', 'title' => 'Thesis 1'],
                ['code' => 'IT404', 'title' => 'Thesis 2'],
                ['code' => 'IT405', 'title' => 'Internship'],
                ['code' => 'IT406', 'title' => 'Special Topics in IT'],
            ],
            'BSCY' => [
                // 1st Year
                ['code' => 'CY101', 'title' => 'Introduction to Cybersecurity'],
                ['code' => 'CY102', 'title' => 'Computer Programming 1'],
                ['code' => 'CY103', 'title' => 'Computer Programming 2'],
                ['code' => 'CY104', 'title' => 'Network Fundamentals'],
                ['code' => 'CY105', 'title' => 'Operating Systems Security'],
                ['code' => 'CY106', 'title' => 'Database Security'],
                ['code' => 'CY107', 'title' => 'Cryptography Fundamentals'],
                ['code' => 'CY108', 'title' => 'Ethical Hacking Basics'],
                
                // 2nd Year
                ['code' => 'CY201', 'title' => 'Network Security'],
                ['code' => 'CY202', 'title' => 'Web Application Security'],
                ['code' => 'CY203', 'title' => 'Malware Analysis'],
                ['code' => 'CY204', 'title' => 'Digital Forensics'],
                ['code' => 'CY205', 'title' => 'Penetration Testing'],
                ['code' => 'CY206', 'title' => 'Security Risk Assessment'],
                ['code' => 'CY207', 'title' => 'Incident Response'],
                ['code' => 'CY208', 'title' => 'Security Policies and Procedures'],
                
                // 3rd Year
                ['code' => 'CY301', 'title' => 'Advanced Cryptography'],
                ['code' => 'CY302', 'title' => 'Cloud Security'],
                ['code' => 'CY303', 'title' => 'Mobile Security'],
                ['code' => 'CY304', 'title' => 'IoT Security'],
                ['code' => 'CY305', 'title' => 'Security Architecture'],
                ['code' => 'CY306', 'title' => 'Compliance and Governance'],
                ['code' => 'CY307', 'title' => 'Threat Intelligence'],
                ['code' => 'CY308', 'title' => 'Security Operations Center'],
                
                // 4th Year
                ['code' => 'CY401', 'title' => 'Capstone Project 1'],
                ['code' => 'CY402', 'title' => 'Capstone Project 2'],
                ['code' => 'CY403', 'title' => 'Thesis 1'],
                ['code' => 'CY404', 'title' => 'Thesis 2'],
                ['code' => 'CY405', 'title' => 'Internship'],
                ['code' => 'CY406', 'title' => 'Special Topics in Cybersecurity'],
            ],
            'BSCE' => [
                // 1st Year
                ['code' => 'CE101', 'title' => 'Introduction to Civil Engineering'],
                ['code' => 'CE102', 'title' => 'Engineering Drawing'],
                ['code' => 'CE103', 'title' => 'Computer Aided Drafting'],
                ['code' => 'CE104', 'title' => 'Engineering Mechanics'],
                ['code' => 'CE105', 'title' => 'Engineering Materials'],
                ['code' => 'CE106', 'title' => 'Surveying 1'],
                ['code' => 'CE107', 'title' => 'Engineering Mathematics 1'],
                ['code' => 'CE108', 'title' => 'Engineering Physics'],
                
                // 2nd Year
                ['code' => 'CE201', 'title' => 'Mechanics of Deformable Bodies'],
                ['code' => 'CE202', 'title' => 'Surveying 2'],
                ['code' => 'CE203', 'title' => 'Engineering Mathematics 2'],
                ['code' => 'CE204', 'title' => 'Fluid Mechanics'],
                ['code' => 'CE205', 'title' => 'Engineering Economics'],
                ['code' => 'CE206', 'title' => 'Construction Materials and Testing'],
                ['code' => 'CE207', 'title' => 'Engineering Geology'],
                ['code' => 'CE208', 'title' => 'Computer Programming for Engineers'],
                
                // 3rd Year
                ['code' => 'CE301', 'title' => 'Structural Analysis 1'],
                ['code' => 'CE302', 'title' => 'Structural Analysis 2'],
                ['code' => 'CE303', 'title' => 'Concrete Design 1'],
                ['code' => 'CE304', 'title' => 'Steel Design 1'],
                ['code' => 'CE305', 'title' => 'Highway Engineering'],
                ['code' => 'CE306', 'title' => 'Hydraulics'],
                ['code' => 'CE307', 'title' => 'Soil Mechanics'],
                ['code' => 'CE308', 'title' => 'Construction Methods'],
                
                // 4th Year
                ['code' => 'CE401', 'title' => 'Concrete Design 2'],
                ['code' => 'CE402', 'title' => 'Steel Design 2'],
                ['code' => 'CE403', 'title' => 'Foundation Engineering'],
                ['code' => 'CE404', 'title' => 'Water Resources Engineering'],
                ['code' => 'CE405', 'title' => 'Capstone Project 1'],
                ['code' => 'CE406', 'title' => 'Capstone Project 2'],
                ['code' => 'CE407', 'title' => 'Thesis 1'],
                ['code' => 'CE408', 'title' => 'Thesis 2'],
            ],
            'BSBA-MKT' => [
                // 1st Year
                ['code' => 'MKT101', 'title' => 'Principles of Marketing'],
                ['code' => 'MKT102', 'title' => 'Business Mathematics'],
                ['code' => 'MKT103', 'title' => 'Business Communication'],
                ['code' => 'MKT104', 'title' => 'Principles of Management'],
                ['code' => 'MKT105', 'title' => 'Business Law'],
                ['code' => 'MKT106', 'title' => 'Microeconomics'],
                ['code' => 'MKT107', 'title' => 'Accounting Principles'],
                ['code' => 'MKT108', 'title' => 'Business Statistics'],
                
                // 2nd Year
                ['code' => 'MKT201', 'title' => 'Consumer Behavior'],
                ['code' => 'MKT202', 'title' => 'Marketing Research'],
                ['code' => 'MKT203', 'title' => 'Advertising and Promotion'],
                ['code' => 'MKT204', 'title' => 'Sales Management'],
                ['code' => 'MKT205', 'title' => 'Macroeconomics'],
                ['code' => 'MKT206', 'title' => 'Financial Management'],
                ['code' => 'MKT207', 'title' => 'Operations Management'],
                ['code' => 'MKT208', 'title' => 'Human Resource Management'],
                
                // 3rd Year
                ['code' => 'MKT301', 'title' => 'Digital Marketing'],
                ['code' => 'MKT302', 'title' => 'Brand Management'],
                ['code' => 'MKT303', 'title' => 'International Marketing'],
                ['code' => 'MKT304', 'title' => 'Retail Management'],
                ['code' => 'MKT305', 'title' => 'Marketing Strategy'],
                ['code' => 'MKT306', 'title' => 'E-Commerce'],
                ['code' => 'MKT307', 'title' => 'Customer Relationship Management'],
                ['code' => 'MKT308', 'title' => 'Marketing Analytics'],
                
                // 4th Year
                ['code' => 'MKT401', 'title' => 'Strategic Marketing'],
                ['code' => 'MKT402', 'title' => 'Marketing Management'],
                ['code' => 'MKT403', 'title' => 'Capstone Project 1'],
                ['code' => 'MKT404', 'title' => 'Capstone Project 2'],
                ['code' => 'MKT405', 'title' => 'Thesis 1'],
                ['code' => 'MKT406', 'title' => 'Thesis 2'],
                ['code' => 'MKT407', 'title' => 'Internship'],
                ['code' => 'MKT408', 'title' => 'Special Topics in Marketing'],
            ]
        ];

        // Combine all courses
        $allCourses = $commonCourses;
        foreach ($programCourses as $program => $courses) {
            $allCourses = array_merge($allCourses, $courses);
        }

        // Create all courses
        foreach ($allCourses as $courseData) {
            Course::firstOrCreate(
                ['course_code' => $courseData['code']],
                [
                    'course_title' => $courseData['title'],
                    'course_description' => 'Description for ' . $courseData['title'],
                    'with_laboratory' => rand(0, 1) == 1,
                    'is_specialize' => !in_array($courseData['code'], array_column($commonCourses, 'code')),
                    'lecture_units' => rand(1, 4),
                    'laboratory_units' => rand(0, 1) == 1 ? rand(1, 2) : 0,
                    'credit_units' => rand(1, 4)
                ]
            );
        }
    }
}