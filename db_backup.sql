--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: approval_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.approval_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.approval_status OWNER TO neondb_owner;

--
-- Name: content_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.content_type AS ENUM (
    'video',
    'pdf',
    'text',
    'quiz'
);


ALTER TYPE public.content_type OWNER TO neondb_owner;

--
-- Name: entity_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.entity_type AS ENUM (
    'course',
    'quiz',
    'masterclass'
);


ALTER TYPE public.entity_type OWNER TO neondb_owner;

--
-- Name: gender; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.gender AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public.gender OWNER TO neondb_owner;

--
-- Name: marital_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.marital_status AS ENUM (
    'single',
    'married',
    'divorced',
    'widowed'
);


ALTER TYPE public.marital_status OWNER TO neondb_owner;

--
-- Name: npa_automation_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.npa_automation_status AS ENUM (
    'pending',
    'sent',
    'error'
);


ALTER TYPE public.npa_automation_status OWNER TO neondb_owner;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payment_status AS ENUM (
    'free',
    'paid',
    'refunded'
);


ALTER TYPE public.payment_status OWNER TO neondb_owner;

--
-- Name: quiz_difficulty; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.quiz_difficulty AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE public.quiz_difficulty OWNER TO neondb_owner;

--
-- Name: quiz_session_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.quiz_session_status AS ENUM (
    'waiting',
    'running',
    'finished'
);


ALTER TYPE public.quiz_session_status OWNER TO neondb_owner;

--
-- Name: quiz_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.quiz_status AS ENUM (
    'draft',
    'active',
    'completed',
    'archived'
);


ALTER TYPE public.quiz_status OWNER TO neondb_owner;

--
-- Name: quiz_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.quiz_type AS ENUM (
    'free',
    'paid',
    'live',
    'practice'
);


ALTER TYPE public.quiz_type OWNER TO neondb_owner;

--
-- Name: rsvp_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.rsvp_status AS ENUM (
    'interested',
    'confirmed',
    'withdrawn'
);


ALTER TYPE public.rsvp_status OWNER TO neondb_owner;

--
-- Name: service_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.service_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE public.service_status OWNER TO neondb_owner;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'doctor',
    'student',
    'service_provider'
);


ALTER TYPE public.user_role OWNER TO neondb_owner;

--
-- Name: visibility; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.visibility AS ENUM (
    'public',
    'private'
);


ALTER TYPE public.visibility OWNER TO neondb_owner;

--
-- Name: voice_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.voice_status AS ENUM (
    'draft',
    'active',
    'closed'
);


ALTER TYPE public.voice_status OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_tool_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_tool_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tool_type character varying(100) NOT NULL,
    input_data text NOT NULL,
    output_data text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_tool_requests OWNER TO neondb_owner;

--
-- Name: ai_tool_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_tool_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_tool_requests_id_seq OWNER TO neondb_owner;

--
-- Name: ai_tool_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_tool_requests_id_seq OWNED BY public.ai_tool_requests.id;


--
-- Name: bigtos_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bigtos_messages (
    id integer NOT NULL,
    mobile character varying(20) NOT NULL,
    message text NOT NULL,
    image_url text,
    type character varying(20) NOT NULL,
    api_response text,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bigtos_messages OWNER TO neondb_owner;

--
-- Name: bigtos_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bigtos_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bigtos_messages_id_seq OWNER TO neondb_owner;

--
-- Name: bigtos_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bigtos_messages_id_seq OWNED BY public.bigtos_messages.id;


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    entity_type public.entity_type NOT NULL,
    entity_id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(150) NOT NULL,
    title character varying(255) NOT NULL,
    rank character varying(50),
    score character varying(50),
    background_image text,
    output_url text,
    sent_status boolean DEFAULT false,
    sent_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.certificates OWNER TO neondb_owner;

--
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificates_id_seq OWNER TO neondb_owner;

--
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- Name: course_certificates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_certificates (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    certificate_url text,
    issued_at timestamp without time zone DEFAULT now(),
    sent_whatsapp boolean DEFAULT false,
    certificate_number character varying(100) NOT NULL
);


ALTER TABLE public.course_certificates OWNER TO neondb_owner;

--
-- Name: course_certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.course_certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_certificates_id_seq OWNER TO neondb_owner;

--
-- Name: course_certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.course_certificates_id_seq OWNED BY public.course_certificates.id;


--
-- Name: course_modules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_modules (
    id integer NOT NULL,
    course_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content_type public.content_type NOT NULL,
    content_url text,
    order_no integer NOT NULL,
    duration integer,
    is_preview boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.course_modules OWNER TO neondb_owner;

--
-- Name: course_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.course_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_modules_id_seq OWNER TO neondb_owner;

--
-- Name: course_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.course_modules_id_seq OWNED BY public.course_modules.id;


--
-- Name: course_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_progress (
    id integer NOT NULL,
    enrollment_id integer NOT NULL,
    module_id integer NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    score integer
);


ALTER TABLE public.course_progress OWNER TO neondb_owner;

--
-- Name: course_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.course_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.course_progress_id_seq OWNER TO neondb_owner;

--
-- Name: course_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.course_progress_id_seq OWNED BY public.course_progress.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    instructor character varying(255),
    duration integer,
    price integer DEFAULT 0,
    thumbnail_image text,
    enrollment_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.courses OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: doctor_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.doctor_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    email character varying(255),
    first_name character varying(100),
    middle_name character varying(100),
    last_name character varying(100),
    dob date,
    gender public.gender,
    marriatialstatus public.marital_status,
    professionaldegree character varying(255),
    profile_pic text,
    thumbl text,
    thumbs text,
    thumbimage text,
    user_mobile character varying(20),
    alternateno character varying(20),
    user_website character varying(255),
    user_facebook character varying(255),
    user_twitter character varying(255),
    user_instagram character varying(255),
    contact_others text,
    ug_admission_year character varying(10),
    ug_location character varying(255),
    ug_college character varying(255),
    pg_admission_year character varying(10),
    pg_location character varying(255),
    pg_college character varying(255),
    pg_type character varying(100),
    pg_branch character varying(100),
    ss_admission_year character varying(10),
    ss_location character varying(255),
    ss_college character varying(255),
    ss_type character varying(100),
    ss_branch character varying(100),
    additionalqualification_course character varying(255),
    additionalqualification_admission_year character varying(10),
    additionalqualification_location character varying(255),
    additionalqualification_college character varying(255),
    additionalqualification_details text,
    job_sector character varying(100),
    job_country character varying(100),
    job_state character varying(100),
    job_city character varying(100),
    job_central_sub character varying(100),
    central_others character varying(255),
    job_state_sub character varying(100),
    state_others character varying(255),
    job_private_hospital character varying(255),
    job_added_private_hospital character varying(255),
    job_medicalcollege character varying(255),
    job_raj_district character varying(100),
    job_raj_block character varying(100),
    job_raj_place character varying(100),
    jaipurarea character varying(100),
    isprofilecomplete boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    approval_status public.approval_status DEFAULT 'pending'::public.approval_status
);


ALTER TABLE public.doctor_profiles OWNER TO neondb_owner;

--
-- Name: doctor_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.doctor_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_profiles_id_seq OWNER TO neondb_owner;

--
-- Name: doctor_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.doctor_profiles_id_seq OWNED BY public.doctor_profiles.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    progress integer DEFAULT 0,
    completed_at timestamp without time zone,
    certificate_issued boolean DEFAULT false,
    enrolled_at timestamp without time zone DEFAULT now(),
    payment_status public.payment_status DEFAULT 'free'::public.payment_status,
    payment_id character varying(100)
);


ALTER TABLE public.enrollments OWNER TO neondb_owner;

--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_id_seq OWNER TO neondb_owner;

--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: entity_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.entity_templates (
    id integer NOT NULL,
    entity_type public.entity_type NOT NULL,
    entity_id integer NOT NULL,
    background_image text NOT NULL,
    font character varying(100) DEFAULT 'Arial'::character varying,
    text_color character varying(20) DEFAULT '#000000'::character varying,
    text_positions text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.entity_templates OWNER TO neondb_owner;

--
-- Name: entity_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.entity_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entity_templates_id_seq OWNER TO neondb_owner;

--
-- Name: entity_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.entity_templates_id_seq OWNED BY public.entity_templates.id;


--
-- Name: hospitals; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.hospitals (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100) DEFAULT 'India'::character varying,
    phone character varying(20),
    email character varying(255),
    website character varying(255),
    specialties text,
    description text,
    image text,
    created_at timestamp without time zone DEFAULT now(),
    district character varying(100),
    contact_numbers text[]
);


ALTER TABLE public.hospitals OWNER TO neondb_owner;

--
-- Name: hospitals_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.hospitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospitals_id_seq OWNER TO neondb_owner;

--
-- Name: hospitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.hospitals_id_seq OWNED BY public.hospitals.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    job_id integer NOT NULL,
    user_id integer NOT NULL,
    cover_letter text,
    status character varying(50) DEFAULT 'pending'::character varying,
    applied_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.job_applications OWNER TO neondb_owner;

--
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_applications_id_seq OWNER TO neondb_owner;

--
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    hospital_id integer,
    hospital_name character varying(255),
    specialty character varying(255),
    location character varying(255),
    state character varying(100),
    city character varying(100),
    experience_required character varying(100),
    salary_range character varying(100),
    job_type character varying(50),
    description text,
    requirements text,
    posted_by integer,
    is_active boolean DEFAULT true,
    posted_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.jobs OWNER TO neondb_owner;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO neondb_owner;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: masterclass_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.masterclass_bookings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    masterclass_id integer NOT NULL,
    booked_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.masterclass_bookings OWNER TO neondb_owner;

--
-- Name: masterclass_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.masterclass_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.masterclass_bookings_id_seq OWNER TO neondb_owner;

--
-- Name: masterclass_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.masterclass_bookings_id_seq OWNED BY public.masterclass_bookings.id;


--
-- Name: masterclasses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.masterclasses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    instructor character varying(255),
    event_date timestamp without time zone NOT NULL,
    duration integer,
    max_participants integer,
    current_participants integer DEFAULT 0,
    price integer DEFAULT 0,
    location character varying(255),
    thumbnail_image text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.masterclasses OWNER TO neondb_owner;

--
-- Name: masterclasses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.masterclasses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.masterclasses_id_seq OWNER TO neondb_owner;

--
-- Name: masterclasses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.masterclasses_id_seq OWNED BY public.masterclasses.id;


--
-- Name: medical_voice_contacts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.medical_voice_contacts (
    id integer NOT NULL,
    voice_id integer NOT NULL,
    name character varying(150),
    designation character varying(100),
    phone character varying(20),
    email character varying(150),
    is_primary boolean DEFAULT false,
    visible boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.medical_voice_contacts OWNER TO neondb_owner;

--
-- Name: medical_voice_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.medical_voice_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_voice_contacts_id_seq OWNER TO neondb_owner;

--
-- Name: medical_voice_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.medical_voice_contacts_id_seq OWNED BY public.medical_voice_contacts.id;


--
-- Name: medical_voice_gathering_joins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.medical_voice_gathering_joins (
    id integer NOT NULL,
    voice_id integer NOT NULL,
    user_id integer NOT NULL,
    status public.rsvp_status DEFAULT 'interested'::public.rsvp_status,
    remarks text,
    joined_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.medical_voice_gathering_joins OWNER TO neondb_owner;

--
-- Name: medical_voice_gathering_joins_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.medical_voice_gathering_joins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_voice_gathering_joins_id_seq OWNER TO neondb_owner;

--
-- Name: medical_voice_gathering_joins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.medical_voice_gathering_joins_id_seq OWNED BY public.medical_voice_gathering_joins.id;


--
-- Name: medical_voice_supporters; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.medical_voice_supporters (
    id integer NOT NULL,
    voice_id integer NOT NULL,
    user_id integer NOT NULL,
    motivation_note text,
    joined_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.medical_voice_supporters OWNER TO neondb_owner;

--
-- Name: medical_voice_supporters_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.medical_voice_supporters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_voice_supporters_id_seq OWNER TO neondb_owner;

--
-- Name: medical_voice_supporters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.medical_voice_supporters_id_seq OWNED BY public.medical_voice_supporters.id;


--
-- Name: medical_voice_updates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.medical_voice_updates (
    id integer NOT NULL,
    voice_id integer NOT NULL,
    update_title character varying(255),
    update_body text,
    created_at timestamp without time zone DEFAULT now(),
    notify_supporters boolean DEFAULT true
);


ALTER TABLE public.medical_voice_updates OWNER TO neondb_owner;

--
-- Name: medical_voice_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.medical_voice_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_voice_updates_id_seq OWNER TO neondb_owner;

--
-- Name: medical_voice_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.medical_voice_updates_id_seq OWNED BY public.medical_voice_updates.id;


--
-- Name: medical_voices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.medical_voices (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    short_description text,
    description text,
    category character varying(100),
    banner_image text,
    related_documents text,
    related_images text,
    concerned_authority character varying(255),
    target_department character varying(255),
    media_contacts text,
    visibility public.visibility DEFAULT 'public'::public.visibility,
    status public.voice_status DEFAULT 'active'::public.voice_status,
    supporters_count integer DEFAULT 0,
    has_gathering boolean DEFAULT false,
    gathering_date timestamp without time zone,
    gathering_location character varying(255),
    gathering_address text,
    gathering_city character varying(100),
    gathering_state character varying(100),
    gathering_pin character varying(20),
    gathering_map_link text,
    gathering_notes text,
    creator_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.medical_voices OWNER TO neondb_owner;

--
-- Name: medical_voices_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.medical_voices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_voices_id_seq OWNER TO neondb_owner;

--
-- Name: medical_voices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.medical_voices_id_seq OWNED BY public.medical_voices.id;


--
-- Name: module_tests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.module_tests (
    id integer NOT NULL,
    module_id integer NOT NULL,
    title character varying(255) NOT NULL,
    total_questions integer DEFAULT 0,
    passing_score integer DEFAULT 60,
    duration integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.module_tests OWNER TO neondb_owner;

--
-- Name: module_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.module_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.module_tests_id_seq OWNER TO neondb_owner;

--
-- Name: module_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.module_tests_id_seq OWNED BY public.module_tests.id;


--
-- Name: npa_automation; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.npa_automation (
    id integer NOT NULL,
    opt_in_id integer NOT NULL,
    user_id integer NOT NULL,
    month character varying(50) NOT NULL,
    year integer NOT NULL,
    generated_pdf_url text,
    status public.npa_automation_status DEFAULT 'pending'::public.npa_automation_status,
    sent_date timestamp without time zone,
    last_error text,
    template_used integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.npa_automation OWNER TO neondb_owner;

--
-- Name: npa_automation_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.npa_automation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.npa_automation_id_seq OWNER TO neondb_owner;

--
-- Name: npa_automation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.npa_automation_id_seq OWNED BY public.npa_automation.id;


--
-- Name: npa_opt_ins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.npa_opt_ins (
    id integer NOT NULL,
    user_id integer NOT NULL,
    doctor_profile_id integer NOT NULL,
    is_active boolean DEFAULT true,
    preferred_day integer DEFAULT 1,
    template_id integer,
    delivery_email character varying(255),
    delivery_whatsapp character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.npa_opt_ins OWNER TO neondb_owner;

--
-- Name: npa_opt_ins_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.npa_opt_ins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.npa_opt_ins_id_seq OWNER TO neondb_owner;

--
-- Name: npa_opt_ins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.npa_opt_ins_id_seq OWNED BY public.npa_opt_ins.id;


--
-- Name: npa_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.npa_templates (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    html_template text NOT NULL,
    placeholders text[] DEFAULT ARRAY[]::text[] NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.npa_templates OWNER TO neondb_owner;

--
-- Name: npa_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.npa_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.npa_templates_id_seq OWNER TO neondb_owner;

--
-- Name: npa_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.npa_templates_id_seq OWNED BY public.npa_templates.id;


--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quiz_attempts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    quiz_id integer NOT NULL,
    score integer NOT NULL,
    total_questions integer NOT NULL,
    time_taken integer,
    passed boolean DEFAULT false,
    certificate_issued boolean DEFAULT false,
    attempted_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quiz_attempts OWNER TO neondb_owner;

--
-- Name: quiz_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quiz_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_attempts_id_seq OWNER TO neondb_owner;

--
-- Name: quiz_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quiz_attempts_id_seq OWNED BY public.quiz_attempts.id;


--
-- Name: quiz_leaderboard; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quiz_leaderboard (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    user_id integer NOT NULL,
    total_score integer DEFAULT 0,
    avg_time integer,
    rank integer,
    certificate_url text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quiz_leaderboard OWNER TO neondb_owner;

--
-- Name: quiz_leaderboard_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quiz_leaderboard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_leaderboard_id_seq OWNER TO neondb_owner;

--
-- Name: quiz_leaderboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quiz_leaderboard_id_seq OWNED BY public.quiz_leaderboard.id;


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quiz_questions (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    question_text text NOT NULL,
    correct_option character varying(1) NOT NULL,
    order_index integer DEFAULT 0,
    image text,
    marks integer DEFAULT 1,
    options text NOT NULL
);


ALTER TABLE public.quiz_questions OWNER TO neondb_owner;

--
-- Name: quiz_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quiz_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_questions_id_seq OWNER TO neondb_owner;

--
-- Name: quiz_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quiz_questions_id_seq OWNED BY public.quiz_questions.id;


--
-- Name: quiz_responses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quiz_responses (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    question_id integer NOT NULL,
    user_id integer NOT NULL,
    selected_option character varying(1),
    is_correct boolean DEFAULT false,
    response_time integer,
    score integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quiz_responses OWNER TO neondb_owner;

--
-- Name: quiz_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quiz_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_responses_id_seq OWNER TO neondb_owner;

--
-- Name: quiz_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quiz_responses_id_seq OWNED BY public.quiz_responses.id;


--
-- Name: quiz_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quiz_sessions (
    id integer NOT NULL,
    quiz_id integer NOT NULL,
    current_question integer DEFAULT 0,
    started_at timestamp without time zone,
    status public.quiz_session_status DEFAULT 'waiting'::public.quiz_session_status,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quiz_sessions OWNER TO neondb_owner;

--
-- Name: quiz_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quiz_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quiz_sessions_id_seq OWNER TO neondb_owner;

--
-- Name: quiz_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quiz_sessions_id_seq OWNED BY public.quiz_sessions.id;


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    passing_score integer DEFAULT 60,
    status public.quiz_status DEFAULT 'draft'::public.quiz_status,
    created_at timestamp without time zone DEFAULT now(),
    category character varying(100),
    difficulty public.quiz_difficulty DEFAULT 'beginner'::public.quiz_difficulty,
    type public.quiz_type DEFAULT 'free'::public.quiz_type,
    total_questions integer DEFAULT 0,
    question_time integer DEFAULT 30,
    duration integer,
    entry_fee integer DEFAULT 0,
    reward_info text,
    certificate_type character varying(100),
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quizzes OWNER TO neondb_owner;

--
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quizzes_id_seq OWNER TO neondb_owner;

--
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- Name: research_service_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.research_service_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    service_type character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status public.service_status DEFAULT 'pending'::public.service_status,
    assigned_to integer,
    estimated_cost integer,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.research_service_requests OWNER TO neondb_owner;

--
-- Name: research_service_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.research_service_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.research_service_requests_id_seq OWNER TO neondb_owner;

--
-- Name: research_service_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.research_service_requests_id_seq OWNED BY public.research_service_requests.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    value text NOT NULL,
    category character varying(50) NOT NULL,
    description text,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.settings OWNER TO neondb_owner;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO neondb_owner;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: test_questions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.test_questions (
    id integer NOT NULL,
    test_id integer NOT NULL,
    question_no integer NOT NULL,
    description text NOT NULL,
    option_a text NOT NULL,
    option_b text NOT NULL,
    option_c text NOT NULL,
    option_d text NOT NULL,
    correct_answer character varying(1) NOT NULL,
    marks integer DEFAULT 1
);


ALTER TABLE public.test_questions OWNER TO neondb_owner;

--
-- Name: test_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.test_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_questions_id_seq OWNER TO neondb_owner;

--
-- Name: test_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.test_questions_id_seq OWNED BY public.test_questions.id;


--
-- Name: test_responses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.test_responses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    test_id integer NOT NULL,
    question_id integer NOT NULL,
    selected_option character varying(1) NOT NULL,
    is_correct boolean NOT NULL,
    score integer DEFAULT 0,
    answered_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.test_responses OWNER TO neondb_owner;

--
-- Name: test_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.test_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_responses_id_seq OWNER TO neondb_owner;

--
-- Name: test_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.test_responses_id_seq OWNED BY public.test_responses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(255),
    role public.user_role DEFAULT 'doctor'::public.user_role NOT NULL,
    otp_code character varying(10),
    otp_expiry timestamp without time zone,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ai_tool_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_tool_requests ALTER COLUMN id SET DEFAULT nextval('public.ai_tool_requests_id_seq'::regclass);


--
-- Name: bigtos_messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bigtos_messages ALTER COLUMN id SET DEFAULT nextval('public.bigtos_messages_id_seq'::regclass);


--
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- Name: course_certificates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_certificates ALTER COLUMN id SET DEFAULT nextval('public.course_certificates_id_seq'::regclass);


--
-- Name: course_modules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_modules ALTER COLUMN id SET DEFAULT nextval('public.course_modules_id_seq'::regclass);


--
-- Name: course_progress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_progress ALTER COLUMN id SET DEFAULT nextval('public.course_progress_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: doctor_profiles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor_profiles ALTER COLUMN id SET DEFAULT nextval('public.doctor_profiles_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: entity_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.entity_templates ALTER COLUMN id SET DEFAULT nextval('public.entity_templates_id_seq'::regclass);


--
-- Name: hospitals id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospitals ALTER COLUMN id SET DEFAULT nextval('public.hospitals_id_seq'::regclass);


--
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: masterclass_bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.masterclass_bookings ALTER COLUMN id SET DEFAULT nextval('public.masterclass_bookings_id_seq'::regclass);


--
-- Name: masterclasses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.masterclasses ALTER COLUMN id SET DEFAULT nextval('public.masterclasses_id_seq'::regclass);


--
-- Name: medical_voice_contacts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_contacts ALTER COLUMN id SET DEFAULT nextval('public.medical_voice_contacts_id_seq'::regclass);


--
-- Name: medical_voice_gathering_joins id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_gathering_joins ALTER COLUMN id SET DEFAULT nextval('public.medical_voice_gathering_joins_id_seq'::regclass);


--
-- Name: medical_voice_supporters id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_supporters ALTER COLUMN id SET DEFAULT nextval('public.medical_voice_supporters_id_seq'::regclass);


--
-- Name: medical_voice_updates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_updates ALTER COLUMN id SET DEFAULT nextval('public.medical_voice_updates_id_seq'::regclass);


--
-- Name: medical_voices id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voices ALTER COLUMN id SET DEFAULT nextval('public.medical_voices_id_seq'::regclass);


--
-- Name: module_tests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_tests ALTER COLUMN id SET DEFAULT nextval('public.module_tests_id_seq'::regclass);


--
-- Name: npa_automation id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_automation ALTER COLUMN id SET DEFAULT nextval('public.npa_automation_id_seq'::regclass);


--
-- Name: npa_opt_ins id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_opt_ins ALTER COLUMN id SET DEFAULT nextval('public.npa_opt_ins_id_seq'::regclass);


--
-- Name: npa_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_templates ALTER COLUMN id SET DEFAULT nextval('public.npa_templates_id_seq'::regclass);


--
-- Name: quiz_attempts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_attempts ALTER COLUMN id SET DEFAULT nextval('public.quiz_attempts_id_seq'::regclass);


--
-- Name: quiz_leaderboard id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_leaderboard ALTER COLUMN id SET DEFAULT nextval('public.quiz_leaderboard_id_seq'::regclass);


--
-- Name: quiz_questions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_questions ALTER COLUMN id SET DEFAULT nextval('public.quiz_questions_id_seq'::regclass);


--
-- Name: quiz_responses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_responses ALTER COLUMN id SET DEFAULT nextval('public.quiz_responses_id_seq'::regclass);


--
-- Name: quiz_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_sessions ALTER COLUMN id SET DEFAULT nextval('public.quiz_sessions_id_seq'::regclass);


--
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- Name: research_service_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.research_service_requests ALTER COLUMN id SET DEFAULT nextval('public.research_service_requests_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: test_questions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_questions ALTER COLUMN id SET DEFAULT nextval('public.test_questions_id_seq'::regclass);


--
-- Name: test_responses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_responses ALTER COLUMN id SET DEFAULT nextval('public.test_responses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ai_tool_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_tool_requests (id, user_id, tool_type, input_data, output_data, created_at) FROM stdin;
1	51	diagnostic_helper	{"symptoms": "Fever, cough, chest pain", "duration": "5 days"}	{"differential_diagnosis": ["Pneumonia", "Bronchitis", "COVID-19"], "recommendations": "Chest X-ray, CBC, COVID test"}	2025-10-12 06:35:57.499981
2	53	stats_calculator	{"data": [120, 135, 142, 128, 156], "test": "t-test"}	{"mean": 136.2, "std_dev": 14.8, "p_value": 0.045}	2025-10-12 06:35:57.499981
3	55	clinical_notes	{"patient_id": "P12345", "complaint": "Hypertension follow-up"}	{"soap_note": "S: Patient reports compliance with medications\\nO: BP 138/86 mmHg\\nA: Controlled hypertension\\nP: Continue current medications"}	2025-10-12 06:35:57.499981
4	56	diagnostic_helper	{"symptoms": "Headache, photophobia, nausea", "duration": "12 hours"}	{"differential_diagnosis": ["Migraine", "Meningitis", "Cluster headache"], "recommendations": "Neurological exam, Consider CT if red flags"}	2025-10-12 06:35:57.499981
5	51	diagnostic_helper	Patient: 65yo male, chest pain radiating to left arm, sweating, BP 140/90, HR 110. ECG shows ST elevation in V1-V4	Likely Diagnosis: Acute Anterior MI (STEMI). Immediate Actions: Aspirin 300mg, Clopidogrel 300mg, Morphine for pain, Oxygen if SpO2<94%, Emergency PCI within 90 min. Monitor: Serial ECG, Troponin levels, Vitals q15min.	2025-10-10 07:25:00.512155
6	52	stats_calculator	Study data: Group A (n=50): Mean=120, SD=15. Group B (n=45): Mean=135, SD=18. Calculate t-test and p-value	Independent Samples t-test Results: t-statistic = -4.32, df = 93, p-value = 0.00004 (p<0.001). Conclusion: Highly significant difference between groups. Effect size (Cohen d) = 0.89 (large effect).	2025-10-07 07:25:00.512155
7	55	clinical_notes	Generate discharge summary for 45yo diabetic patient admitted with DKA, treated with IV insulin, now stable on subcutaneous insulin	DISCHARGE SUMMARY\\nPatient: 45yo diabetic\\nAdmission: Diabetic Ketoacidosis\\nHospital Course: Treated with IV insulin protocol, fluid resuscitation. Transitioned to subcutaneous insulin regimen.\\nDischarge Medications: Insulin Glargine 20 units HS, Insulin Lispro 8-10 units TID with meals\\nFollow-up: Endocrinology clinic in 1 week, Home glucose monitoring QID\\nPatient Education: Sick day management, hypoglycemia recognition	2025-10-11 07:25:00.512155
8	53	diagnostic_helper	22yo female, fever 101F, sore throat, cervical lymphadenopathy, negative rapid strep test	Differential Diagnosis: 1) Infectious Mononucleosis (most likely) 2) Viral pharyngitis 3) Early CMV infection. Recommended Tests: Monospot test, CBC with diff (look for atypical lymphocytes), EBV serology. Management: Symptomatic treatment, avoid contact sports if mono confirmed (splenic rupture risk).	2025-10-09 07:25:00.512155
9	54	stats_calculator	Calculate sample size needed for RCT, power=0.80, alpha=0.05, effect size=0.5	Sample Size Calculation Results:\\nPower Analysis for Independent Samples\\n- Effect size (Cohen d): 0.5 (medium)\\n- Alpha level: 0.05 (two-tailed)\\n- Power: 0.80\\n\\nRequired sample size: 64 per group (128 total)\\nRecommended with 20% dropout: 80 per group (160 total)	2025-10-05 07:25:00.512155
\.


--
-- Data for Name: bigtos_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bigtos_messages (id, mobile, message, image_url, type, api_response, status, created_at) FROM stdin;
1	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:13:57.701446
2	9990172019	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:17:22.408507
3	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:24:23.73059
4	9990172019	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:27:46.01069
5	9990172019	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:28:18.430933
6	9990172019	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:29:11.756221
7	9990172019	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:31:32.857647
8	9799720730	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 20:32:12.646071
9	9799720730	🎓 *Course Enrollment Confirmed*\n\nYou have successfully enrolled in:\n*Advanced Cardiology*\n\nStart learning now on DocsUniverse!	\N	Text	Development mode - not sent	success	2025-10-11 21:02:09.523767
10	9876543210	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 21:10:43.07314
11	9988776655	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 21:13:54.527687
12	9988776655	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-11 21:16:37.582555
13	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-12 03:04:02.911916
14	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-12 03:33:41.959763
15	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-12 03:38:22.915366
16	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-12 03:52:48.507679
17	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	Development mode - not sent	success	2025-10-12 03:55:32.406887
18	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb2bdeb80ce8b2550c21c3","status":"Success","data":""}	failed	2025-10-12 04:17:34.766894
19	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb2bdeb80ce8b2550c21c3","status":"Success","data":""}	failed	2025-10-12 04:17:34.834137
20	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb3029164b145c3d0f91a2","status":"Success","data":""}	failed	2025-10-12 04:35:53.48505
21	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb3029164b145c3d0f91a2","status":"Success","data":""}	failed	2025-10-12 04:35:53.553899
22	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb3140975afcb3ba00d059","status":"Success","data":""}	failed	2025-10-12 04:40:32.415563
23	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb3140975afcb3ba00d059","status":"Success","data":""}	failed	2025-10-12 04:40:32.486686
24	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb32e4120e24d73c09c69f","status":"Success","data":""}	failed	2025-10-12 04:47:32.507956
25	9999999999	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb32e4120e24d73c09c69f","status":"Success","data":""}	failed	2025-10-12 04:47:32.577421
26	9000000001	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb41f428cf8ad5570649b1","status":"Success","data":""}	failed	2025-10-12 05:51:48.704787
27	9000000001	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb41f428cf8ad5570649b1","status":"Success","data":""}	failed	2025-10-12 05:51:48.772472
28	9000000002	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb431e28cf8ad557064a9d","status":"Success","data":""}	failed	2025-10-12 05:56:46.462304
29	9000000002	Your DocsUniverse verification code is: *123456*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb431e28cf8ad557064a9d","status":"Success","data":""}	failed	2025-10-12 05:56:46.580309
30	9111111112	Test WhatsApp message for filtered doctors	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb446a42633dff480611fe","status":"Success","data":""}	failed	2025-10-12 06:02:18.869982
31	9111111112	Test WhatsApp message for filtered doctors	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb446a42633dff480611fe","status":"Success","data":""}	failed	2025-10-12 06:02:18.943379
32	9333333334	Test WhatsApp message for filtered doctors	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb446bd2901a849102a80e","status":"Success","data":""}	failed	2025-10-12 06:02:19.270554
33	9333333334	Test WhatsApp message for filtered doctors	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb446bd2901a849102a80e","status":"Success","data":""}	failed	2025-10-12 06:02:19.330392
34	9111111113	Test WhatsApp message for filtered doctors	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb446bd9f9f2b50b045507","status":"Success","data":""}	failed	2025-10-12 06:02:19.661635
35	9111111113	Test WhatsApp message for filtered doctors	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb446bd9f9f2b50b045507","status":"Success","data":""}	failed	2025-10-12 06:02:19.721208
36	9333333335	Test WhatsApp message for filtered doctors	\N	Text	{"msg":"Messages Sent Successfully.","msg_id":"68eb446b9335f7aa3301a905","status":"Success","data":""}	failed	2025-10-12 06:02:20.061157
37	9333333335	Test WhatsApp message for filtered doctors	\N	Text	BigTos API failed: {"msg":"Messages Sent Successfully.","msg_id":"68eb446b9335f7aa3301a905","status":"Success","data":""}	failed	2025-10-12 06:02:20.120721
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.certificates (id, entity_type, entity_id, user_id, name, title, rank, score, background_image, output_url, sent_status, sent_at, created_at) FROM stdin;
\.


--
-- Data for Name: course_certificates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_certificates (id, user_id, course_id, certificate_url, issued_at, sent_whatsapp, certificate_number) FROM stdin;
\.


--
-- Data for Name: course_modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_modules (id, course_id, title, content_type, content_url, order_no, duration, is_preview, created_at) FROM stdin;
2	2	hi	text		1	4	t	2025-10-12 04:19:42.625278
3	9	hhaha	video		1	0	f	2025-10-12 04:50:42.177863
4	10	Introduction to Clinical Examination	video	https://example.com/videos/intro-clinical-exam.mp4	1	45	t	2025-10-12 06:30:36.771437
5	10	Vital Signs Monitoring Techniques	video	https://example.com/videos/vital-signs.mp4	2	60	f	2025-10-12 06:30:36.771437
6	10	Patient History Taking - Best Practices	pdf	https://example.com/pdfs/history-taking.pdf	3	30	f	2025-10-12 06:30:36.771437
7	10	Physical Examination Skills	video	https://example.com/videos/physical-exam.mp4	4	90	f	2025-10-12 06:30:36.771437
8	10	Module 1 Assessment	quiz	\N	5	20	f	2025-10-12 06:30:36.771437
9	11	ECG Basics and Lead Placement	video	https://example.com/videos/ecg-basics.mp4	1	50	t	2025-10-12 06:30:36.771437
10	11	Normal Cardiac Rhythms	pdf	https://example.com/pdfs/normal-rhythms.pdf	2	40	f	2025-10-12 06:30:36.771437
11	11	Arrhythmia Recognition	video	https://example.com/videos/arrhythmia.mp4	3	70	f	2025-10-12 06:30:36.771437
12	11	STEMI and ACS Diagnosis	video	https://example.com/videos/stemi-acs.mp4	4	80	f	2025-10-12 06:30:36.771437
13	11	Cardiology Module Test	quiz	\N	5	25	f	2025-10-12 06:30:36.771437
14	12	Pediatric Assessment Triangle	video	https://example.com/videos/ped-assessment.mp4	1	35	t	2025-10-12 06:30:36.771437
15	12	Respiratory Emergencies in Children	video	https://example.com/videos/ped-respiratory.mp4	2	55	f	2025-10-12 06:30:36.771437
16	12	Pediatric Trauma Management	pdf	https://example.com/pdfs/ped-trauma.pdf	3	45	f	2025-10-12 06:30:36.771437
17	12	Emergency Medicine Assessment	quiz	\N	4	20	f	2025-10-12 06:30:36.771437
18	13	Surgical Instruments Overview	video	https://example.com/videos/surgical-instruments.mp4	1	40	t	2025-10-12 06:30:36.771437
19	13	Basic Suturing Techniques	video	https://example.com/videos/suturing-basic.mp4	2	75	f	2025-10-12 06:30:36.771437
20	13	Advanced Suturing Patterns	video	https://example.com/videos/suturing-advanced.mp4	3	85	f	2025-10-12 06:30:36.771437
21	13	Wound Management and Closure	pdf	https://example.com/pdfs/wound-management.pdf	4	50	f	2025-10-12 06:30:36.771437
22	13	Surgical Skills Test	quiz	\N	5	30	f	2025-10-12 06:30:36.771437
23	14	Research Methodology Basics	video	https://example.com/videos/research-methods.mp4	1	50	t	2025-10-12 06:30:36.771437
24	14	Statistical Analysis Fundamentals	pdf	https://example.com/pdfs/statistics-basics.pdf	2	60	f	2025-10-12 06:30:36.771437
25	14	Critical Appraisal of Studies	video	https://example.com/videos/critical-appraisal.mp4	3	55	f	2025-10-12 06:30:36.771437
26	14	Research Module Quiz	quiz	\N	4	25	f	2025-10-12 06:30:36.771437
27	15	Introduction to Advanced ECG Interpretation	video	https://www.youtube.com/watch?v=dQw4w9WgXcQ	1	45	t	2025-10-12 07:14:14.304227
28	15	Cardiac Biomarkers and Diagnostic Algorithms	text	\N	2	30	f	2025-10-12 07:14:14.304227
29	15	Advanced Heart Failure Management	video	https://www.youtube.com/watch?v=dQw4w9WgXcQ	3	60	f	2025-10-12 07:14:14.304227
30	15	ECG and Biomarkers Assessment	quiz	\N	4	20	f	2025-10-12 07:14:14.304227
31	15	Interventional Cardiology Techniques	text	\N	5	40	f	2025-10-12 07:14:14.304227
32	15	Heart Failure and Interventions Final Assessment	quiz	\N	6	25	f	2025-10-12 07:14:14.304227
33	1	Introduction to Advanced ECG	video	https://www.youtube.com/watch?v=dQw4w9WgXcQ	1	30	t	2025-10-12 07:19:34.522469
34	1	Cardiac Biomarkers	text	\N	2	20	f	2025-10-12 07:19:34.522469
35	1	ECG Assessment Quiz	quiz	\N	3	15	f	2025-10-12 07:19:34.522469
36	5	Research Design Fundamentals	video	https://www.youtube.com/watch?v=dQw4w9WgXcQ	1	40	t	2025-10-12 07:19:34.522469
37	5	Statistical Analysis Basics	pdf	https://example.com/stats.pdf	2	35	f	2025-10-12 07:19:34.522469
38	5	Ethics in Research	text	\N	3	25	f	2025-10-12 07:19:34.522469
39	5	Research Methods Quiz	quiz	\N	4	20	f	2025-10-12 07:19:34.522469
40	8	Principles of Medical Ethics	video	https://www.youtube.com/watch?v=dQw4w9WgXcQ	1	35	t	2025-10-12 07:19:34.522469
41	8	Patient Confidentiality	text	\N	2	25	f	2025-10-12 07:19:34.522469
42	8	Informed Consent	text	\N	3	30	f	2025-10-12 07:19:34.522469
43	8	Medical Ethics Quiz	quiz	\N	4	20	f	2025-10-12 07:19:34.522469
\.


--
-- Data for Name: course_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_progress (id, enrollment_id, module_id, completed, completed_at, score) FROM stdin;
1	1	4	t	\N	\N
2	1	5	t	\N	\N
3	3	14	t	\N	\N
4	3	15	t	\N	\N
5	3	16	t	\N	\N
6	3	17	t	\N	85
7	4	4	t	\N	\N
8	4	5	t	\N	\N
9	4	6	t	\N	\N
10	10	27	t	2025-09-28 07:26:12.433497	\N
11	10	28	t	2025-09-29 07:26:12.433497	\N
12	14	33	t	2025-09-14 07:26:12.433497	\N
13	14	34	t	2025-09-17 07:26:12.433497	\N
14	14	35	t	2025-09-18 07:26:12.433497	85
15	21	33	t	2025-08-25 07:26:12.433497	\N
16	21	34	t	2025-08-27 07:26:12.433497	\N
17	21	35	t	2025-08-28 07:26:12.433497	92
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.courses (id, title, description, instructor, duration, price, thumbnail_image, enrollment_count, is_active, created_at, updated_at) FROM stdin;
2	Pediatric Emergency Care	Essential skills for handling pediatric emergencies	Dr. Priya Patel	51	12568	\N	484	t	2025-10-11 19:32:54.326321	2025-10-11 19:32:54.326321
3	Surgical Techniques	Modern surgical methods and best practices	Dr. Amit Singh	26	18057	\N	75	t	2025-10-11 19:32:54.390415	2025-10-11 19:32:54.390415
4	Radiology Imaging	Advanced imaging techniques and interpretation	Dr. Neha Kumar	47	10721	\N	481	t	2025-10-11 19:32:54.450265	2025-10-11 19:32:54.450265
5	Clinical Research Methods	Introduction to clinical trials and research	Dr. Vikram Gupta	43	14958	\N	78	t	2025-10-11 19:32:54.512173	2025-10-11 19:32:54.512173
6	Oncology Updates	Latest developments in cancer treatment	Dr. Anjali Reddy	53	16683	\N	314	t	2025-10-11 19:32:54.573364	2025-10-11 19:32:54.573364
7	Neurosurgical Approaches	Advanced neurosurgical techniques	Dr. Rahul Nair	43	9307	\N	197	t	2025-10-11 19:32:54.633789	2025-10-11 19:32:54.633789
8	Medical Ethics	Ethical considerations in modern medicine	Dr. Sneha Mehta	59	6685	\N	239	t	2025-10-11 19:32:54.696178	2025-10-11 19:32:54.696178
1	Advanced Cardiology	Comprehensive course on cardiovascular diseases and treatments	Dr. Rajesh Sharma	31	14534	\N	43	t	2025-10-11 19:32:54.258714	2025-10-11 19:32:54.258714
9				0	0		0	t	2025-10-12 04:50:19.134	2025-10-12 04:50:19.134
10	Basic Clinical Skills & Patient Assessment	Master fundamental clinical examination techniques, vital signs monitoring, and patient assessment protocols essential for every healthcare professional.	Dr. Rajesh Kumar	12	2999	\N	0	t	2025-10-12 06:30:16.201664	2025-10-12 06:30:16.201664
11	Advanced Cardiology: ECG Interpretation	Comprehensive course on reading and interpreting ECGs, understanding cardiac rhythms, and identifying life-threatening conditions.	Dr. Priya Sharma	8	3499	\N	0	t	2025-10-12 06:30:16.201664	2025-10-12 06:30:16.201664
12	Pediatric Emergency Medicine	Learn to manage pediatric emergencies, from respiratory distress to trauma care, with evidence-based protocols.	Dr. Amit Patel	10	0	\N	0	t	2025-10-12 06:30:16.201664	2025-10-12 06:30:16.201664
13	Surgical Techniques & Suturing Mastery	Step-by-step video demonstrations of surgical techniques, suturing methods, and wound management.	Dr. Sunita Reddy	15	4999	\N	0	t	2025-10-12 06:30:16.201664	2025-10-12 06:30:16.201664
14	Medical Research & Statistics Made Easy	Understand research methodology, statistical analysis, and how to critically appraise medical literature.	Dr. Vikram Singh	6	1999	\N	0	t	2025-10-12 06:30:16.201664	2025-10-12 06:30:16.201664
15	Advanced Clinical Cardiology	Master advanced cardiovascular diagnostics, treatment protocols, and patient management. Includes comprehensive testing to validate your knowledge.	Dr. Sarah Johnson, MD Cardiology	180	4999	https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800	0	t	2025-10-12 07:13:06.275109	2025-10-12 07:13:06.275109
\.


--
-- Data for Name: doctor_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.doctor_profiles (id, user_id, email, first_name, middle_name, last_name, dob, gender, marriatialstatus, professionaldegree, profile_pic, thumbl, thumbs, thumbimage, user_mobile, alternateno, user_website, user_facebook, user_twitter, user_instagram, contact_others, ug_admission_year, ug_location, ug_college, pg_admission_year, pg_location, pg_college, pg_type, pg_branch, ss_admission_year, ss_location, ss_college, ss_type, ss_branch, additionalqualification_course, additionalqualification_admission_year, additionalqualification_location, additionalqualification_college, additionalqualification_details, job_sector, job_country, job_state, job_city, job_central_sub, central_others, job_state_sub, state_others, job_private_hospital, job_added_private_hospital, job_medicalcollege, job_raj_district, job_raj_block, job_raj_place, jaipurarea, isprofilecomplete, created_at, updated_at, approval_status) FROM stdin;
1	1	dr.rajesh.sharma@example.com	Rajesh	\N	Sharma	1978-02-01	male	married	MBBS, MD	\N	\N	\N	\N	9810000000	\N	\N	\N	\N	\N	\N	1995	Jaipur	AIIMS Delhi	2000	Delhi	SMS Medical College	\N	Cardiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	India	Rajasthan	Jaipur	\N	\N	\N	\N	Fortis Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:18.990756	2025-10-11 19:32:18.990756	pending
2	2	dr.priya.patel@example.com	Priya	\N	Patel	1999-02-01	female	single	MBBS, MS	\N	\N	\N	\N	9810000001	\N	\N	\N	\N	\N	\N	1996	Delhi	Maulana Azad Medical College	2001	Mumbai	King George's Medical University	\N	Neurology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Delhi	Delhi	\N	\N	\N	\N	Apollo Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.072184	2025-10-11 19:32:19.072184	pending
3	3	dr.amit.singh@example.com	Amit	\N	Singh	1999-01-01	male	single	MBBS, DM	\N	\N	\N	\N	9810000002	\N	\N	\N	\N	\N	\N	1997	Mumbai	SMS Medical College	2002	Bangalore	Christian Medical College Vellore	\N	Orthopedics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Maharashtra	Mumbai	\N	\N	\N	\N	AIIMS	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.134528	2025-10-11 19:32:19.134528	pending
4	4	dr.neha.kumar@example.com	Neha	\N	Kumar	1977-03-01	female	married	MBBS, DNB	\N	\N	\N	\N	9810000003	\N	\N	\N	\N	\N	\N	1998	Bangalore	King George's Medical University	2003	Chennai	Kasturba Medical College	\N	Pediatrics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	India	Karnataka	Bangalore	\N	\N	\N	\N	Max Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.195104	2025-10-11 19:32:19.195104	pending
5	5	dr.vikram.gupta@example.com	Vikram	\N	Gupta	1989-04-01	male	single	MBBS, MCh	\N	\N	\N	\N	9810000004	\N	\N	\N	\N	\N	\N	1999	Chennai	Christian Medical College Vellore	2004	Kolkata	JIPMER Puducherry	\N	Dermatology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Tamil Nadu	Chennai	\N	\N	\N	\N	Manipal Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.255441	2025-10-11 19:32:19.255441	pending
6	6	dr.anjali.reddy@example.com	Anjali	\N	Reddy	1984-08-01	female	single	MBBS, MD	\N	\N	\N	\N	9810000005	\N	\N	\N	\N	\N	\N	2000	Kolkata	Kasturba Medical College	2005	Hyderabad	Bangalore Medical College	\N	Radiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	West Bengal	Kolkata	\N	\N	\N	\N	Medanta	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.314594	2025-10-11 19:32:19.314594	pending
7	7	dr.rahul.nair@example.com	Rahul	\N	Nair	1988-02-01	male	married	MBBS, MS	\N	\N	\N	\N	9810000006	\N	\N	\N	\N	\N	\N	2001	Hyderabad	JIPMER Puducherry	2006	Pune	Madras Medical College	\N	General Surgery	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	India	Telangana	Hyderabad	\N	\N	\N	\N	Narayana Health	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.375525	2025-10-11 19:32:19.375525	pending
8	8	dr.sneha.mehta@example.com	Sneha	\N	Mehta	1999-10-01	female	single	MBBS, DM	\N	\N	\N	\N	9810000007	\N	\N	\N	\N	\N	\N	2002	Pune	Bangalore Medical College	2007	Ahmedabad	Grant Medical College Mumbai	\N	Oncology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Gujarat	Pune	\N	\N	\N	\N	Cloudnine Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.435326	2025-10-11 19:32:19.435326	pending
9	9	dr.arun.joshi@example.com	Arun	\N	Joshi	1979-01-01	male	single	MBBS, DNB	\N	\N	\N	\N	9810000008	\N	\N	\N	\N	\N	\N	2003	Ahmedabad	Madras Medical College	2008	Kota	AIIMS Delhi	\N	Psychiatry	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Rajasthan	Ahmedabad	\N	\N	\N	\N	Columbia Asia	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.494664	2025-10-11 19:32:19.494664	pending
10	10	dr.kavita.iyer@example.com	Kavita	\N	Iyer	1981-09-01	female	married	MBBS, MCh	\N	\N	\N	\N	9810000009	\N	\N	\N	\N	\N	\N	2004	Kota	Grant Medical College Mumbai	2009	Jaipur	Maulana Azad Medical College	\N	Anesthesiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	India	Delhi	Kota	\N	\N	\N	\N	Kokilaben Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.556066	2025-10-11 19:32:19.556066	pending
11	11	dr.suresh.sharma@example.com	Suresh	\N	Sharma	1978-12-01	male	single	MBBS, MD	\N	\N	\N	\N	9810000010	\N	\N	\N	\N	\N	\N	2005	Jaipur	AIIMS Delhi	2010	Delhi	SMS Medical College	\N	Cardiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Maharashtra	Jaipur	\N	\N	\N	\N	Fortis Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.616367	2025-10-11 19:32:19.616367	pending
12	12	dr.meena.patel@example.com	Meena	\N	Patel	1990-05-01	female	single	MBBS, MS	\N	\N	\N	\N	9810000011	\N	\N	\N	\N	\N	\N	2006	Delhi	Maulana Azad Medical College	2011	Mumbai	King George's Medical University	\N	Neurology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Karnataka	Delhi	\N	\N	\N	\N	Apollo Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.675552	2025-10-11 19:32:19.675552	pending
13	13	dr.deepak.singh@example.com	Deepak	\N	Singh	1985-04-01	male	married	MBBS, DM	\N	\N	\N	\N	9810000012	\N	\N	\N	\N	\N	\N	2007	Mumbai	SMS Medical College	2012	Bangalore	Christian Medical College Vellore	\N	Orthopedics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	India	Tamil Nadu	Mumbai	\N	\N	\N	\N	AIIMS	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.735544	2025-10-11 19:32:19.735544	pending
14	14	dr.lakshmi.kumar@example.com	Lakshmi	\N	Kumar	1985-05-01	female	single	MBBS, DNB	\N	\N	\N	\N	9810000013	\N	\N	\N	\N	\N	\N	2008	Bangalore	King George's Medical University	2013	Chennai	Kasturba Medical College	\N	Pediatrics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	West Bengal	Bangalore	\N	\N	\N	\N	Max Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.796263	2025-10-11 19:32:19.796263	pending
15	15	dr.ravi.gupta@example.com	Ravi	\N	Gupta	1984-06-01	male	single	MBBS, MCh	\N	\N	\N	\N	9810000014	\N	\N	\N	\N	\N	\N	2009	Chennai	Christian Medical College Vellore	2014	Kolkata	JIPMER Puducherry	\N	Dermatology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Telangana	Chennai	\N	\N	\N	\N	Manipal Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.858367	2025-10-11 19:32:19.858367	pending
16	16	dr.divya.reddy@example.com	Divya	\N	Reddy	1978-03-01	female	married	MBBS, MD	\N	\N	\N	\N	9810000015	\N	\N	\N	\N	\N	\N	2010	Kolkata	Kasturba Medical College	2015	Hyderabad	Bangalore Medical College	\N	Radiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	India	Gujarat	Kolkata	\N	\N	\N	\N	Medanta	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.919909	2025-10-11 19:32:19.919909	pending
17	17	dr.karthik.nair@example.com	Karthik	\N	Nair	1996-02-01	male	single	MBBS, MS	\N	\N	\N	\N	9810000016	\N	\N	\N	\N	\N	\N	2011	Hyderabad	JIPMER Puducherry	2016	Pune	Madras Medical College	\N	General Surgery	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Rajasthan	Hyderabad	\N	\N	\N	\N	Narayana Health	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:19.980269	2025-10-11 19:32:19.980269	pending
18	18	dr.pooja.mehta@example.com	Pooja	\N	Mehta	1999-08-01	female	single	MBBS, DM	\N	\N	\N	\N	9810000017	\N	\N	\N	\N	\N	\N	2012	Pune	Bangalore Medical College	2017	Ahmedabad	Grant Medical College Mumbai	\N	Oncology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Delhi	Pune	\N	\N	\N	\N	Cloudnine Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:20.040126	2025-10-11 19:32:20.040126	pending
19	19	dr.sandeep.joshi@example.com	Sandeep	\N	Joshi	1980-11-01	male	married	MBBS, DNB	\N	\N	\N	\N	9810000018	\N	\N	\N	\N	\N	\N	2013	Ahmedabad	Madras Medical College	2018	Kota	AIIMS Delhi	\N	Psychiatry	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	India	Maharashtra	Ahmedabad	\N	\N	\N	\N	Columbia Asia	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:20.099879	2025-10-11 19:32:20.099879	pending
20	20	dr.nisha.iyer@example.com	Nisha	\N	Iyer	1982-02-01	female	single	MBBS, MCh	\N	\N	\N	\N	9810000019	\N	\N	\N	\N	\N	\N	2014	Kota	Grant Medical College Mumbai	2019	Jaipur	Maulana Azad Medical College	\N	Anesthesiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	India	Karnataka	Kota	\N	\N	\N	\N	Kokilaben Hospital	\N	\N	\N	\N	\N	\N	f	2025-10-11 19:32:20.160075	2025-10-11 19:32:20.160075	pending
22	34	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9111111111	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Cardiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2025-10-12 05:51:22.250913	2025-10-12 05:51:22.250913	pending
23	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9222222222	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	JIPMER Puducherry	\N	Orthopedics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Delhi	Delhi	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2025-10-12 05:51:22.311573	2025-10-12 05:51:22.311573	pending
24	36	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9333333333	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Neurology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2025-10-12 05:51:22.368134	2025-10-12 05:51:22.368134	pending
26	41	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9111111112	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Cardiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 05:56:24.305076	2025-10-12 05:56:24.305076	approved
27	42	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9222222223	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	JIPMER Puducherry	\N	Orthopedics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Delhi	Delhi	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 05:56:24.305076	2025-10-12 05:56:24.305076	approved
28	43	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9333333334	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Neurology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 05:56:24.305076	2025-10-12 05:56:24.305076	approved
30	45	\N	John	\N	Smith	\N	\N	\N	\N	\N	\N	\N	\N	9111111113	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Cardiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 06:00:52.761112	2025-10-12 06:00:52.761112	approved
31	46	\N	Jane	\N	Doe	\N	\N	\N	\N	\N	\N	\N	\N	9222222224	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	JIPMER Puducherry	\N	Orthopedics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Delhi	Delhi	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 06:00:52.825048	2025-10-12 06:00:52.825048	approved
32	47	\N	Bob	\N	Johnson	\N	\N	\N	\N	\N	\N	\N	\N	9333333335	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Neurology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 06:00:52.882649	2025-10-12 06:00:52.882649	approved
33	49	\N	Alice	\N	Kumar	\N	\N	\N	\N	\N	\N	\N	\N	9111111114	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Cardiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 06:05:15.58	2025-10-12 06:05:15.58	approved
34	50	\N	Raj	\N	Patel	\N	\N	\N	\N	\N	\N	\N	\N	9222222225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AIIMS Delhi	\N	Neurology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Maharashtra	Mumbai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	2025-10-12 06:05:15.58	2025-10-12 06:05:15.58	approved
35	51	rajesh.kumar@example.com	Rajesh	\N	Kumar	\N	male	\N	MBBS, MD (Cardiology)	\N	\N	\N	\N	9999999991	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Cardiology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2025-10-12 07:18:47.243288	2025-10-12 07:18:47.243288	approved
36	52	priya.sharma@example.com	Priya	\N	Sharma	\N	female	\N	MBBS, DNB (Pediatrics)	\N	\N	\N	\N	9999999992	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Pediatrics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2025-10-12 07:18:47.243288	2025-10-12 07:18:47.243288	approved
37	55	amit.patel@example.com	Amit	\N	Patel	\N	male	\N	MBBS, MS (Orthopedics)	\N	\N	\N	\N	9999999995	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Orthopedics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Government	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2025-10-12 07:18:47.243288	2025-10-12 07:18:47.243288	approved
38	57	arjun.mehta@example.com	Arjun	\N	Mehta	\N	male	\N	MBBS, MD (General Medicine)	\N	\N	\N	\N	9999999997	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	General Medicine	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Private	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	2025-10-12 07:18:47.243288	2025-10-12 07:18:47.243288	approved
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.enrollments (id, user_id, course_id, progress, completed_at, certificate_issued, enrolled_at, payment_status, payment_id) FROM stdin;
1	30	1	0	\N	f	2025-10-11 21:02:09.221878	free	\N
2	51	10	40	\N	f	2025-10-12 06:36:14.953602	paid	PAY_001
3	51	11	0	\N	f	2025-10-12 06:36:14.953602	paid	PAY_002
4	53	12	100	\N	f	2025-10-12 06:36:14.953602	free	\N
5	54	10	60	\N	f	2025-10-12 06:36:14.953602	paid	PAY_003
6	55	14	80	\N	f	2025-10-12 06:36:14.953602	paid	PAY_004
7	56	12	30	\N	f	2025-10-12 06:36:14.953602	free	\N
8	57	13	20	\N	f	2025-10-12 06:36:14.953602	paid	PAY_005
9	58	10	90	\N	f	2025-10-12 06:36:14.953602	paid	PAY_006
10	51	15	40	\N	f	2025-09-27 07:25:59.819022	paid	\N
11	51	11	100	\N	f	2025-08-13 07:25:59.819022	paid	\N
12	52	12	60	\N	f	2025-09-22 07:25:59.819022	paid	\N
13	52	5	25	\N	f	2025-10-07 07:25:59.819022	free	\N
14	53	1	80	\N	f	2025-09-12 07:25:59.819022	free	\N
15	53	8	100	\N	f	2025-08-28 07:25:59.819022	free	\N
16	53	14	15	\N	f	2025-10-09 07:25:59.819022	free	\N
17	54	9	50	\N	f	2025-10-02 07:25:59.819022	free	\N
18	54	13	70	\N	f	2025-09-17 07:25:59.819022	paid	\N
19	55	5	90	\N	f	2025-09-02 07:25:59.819022	paid	\N
20	55	15	20	\N	f	2025-10-05 07:25:59.819022	paid	\N
21	56	1	100	\N	f	2025-08-23 07:25:59.819022	free	\N
22	56	12	35	\N	f	2025-09-30 07:25:59.819022	free	\N
23	57	14	100	\N	f	2025-08-18 07:25:59.819022	paid	\N
24	57	8	45	\N	f	2025-10-04 07:25:59.819022	free	\N
\.


--
-- Data for Name: entity_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.entity_templates (id, entity_type, entity_id, background_image, font, text_color, text_positions, created_at, updated_at) FROM stdin;
1	course	1	https://example.com/cert-bg.jpg	Arial	#000000	{\n  "name": {\n    "x": 400,\n    "y": 300,\n    "alignment": "center",\n    "fontSize": 48\n  },\n  "title": {\n    "x": 400,\n    "y": 400,\n    "alignment": "center",\n    "fontSize": 32\n  },\n  "date": {\n    "x": 400,\n    "y": 500,\n    "alignment": "center",\n    "fontSize": 24\n  }\n}	2025-10-12 03:56:15.676881	2025-10-12 03:56:15.676881
\.


--
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.hospitals (id, name, address, city, state, country, phone, email, website, specialties, description, image, created_at, district, contact_numbers) FROM stdin;
1	Fortis Hospital	\N	\N	\N	India	\N	\N	\N	{"Cardiology","Neurology","Orthopedics"}	\N	\N	2025-10-11 19:29:56.665523	\N	\N
2	Apollo Hospital	\N	\N	\N	India	\N	\N	\N	{"Neurology","Orthopedics","Pediatrics"}	\N	\N	2025-10-11 19:29:56.732614	\N	\N
3	AIIMS	\N	\N	\N	India	\N	\N	\N	{"Orthopedics","Pediatrics","Dermatology"}	\N	\N	2025-10-11 19:29:56.792305	\N	\N
4	Max Hospital	\N	\N	\N	India	\N	\N	\N	{"Pediatrics","Dermatology","Radiology"}	\N	\N	2025-10-11 19:29:56.856826	\N	\N
5	Manipal Hospital	\N	\N	\N	India	\N	\N	\N	{"Dermatology","Radiology","General Surgery"}	\N	\N	2025-10-11 19:29:56.940011	\N	\N
6	Medanta	\N	\N	\N	India	\N	\N	\N	{"Radiology","General Surgery","Oncology"}	\N	\N	2025-10-11 19:29:57.0002	\N	\N
7	Narayana Health	\N	\N	\N	India	\N	\N	\N	{"General Surgery","Oncology","Psychiatry"}	\N	\N	2025-10-11 19:29:57.06004	\N	\N
8	Cloudnine Hospital	\N	\N	\N	India	\N	\N	\N	{"Oncology","Psychiatry","Anesthesiology"}	\N	\N	2025-10-11 19:29:57.123379	\N	\N
9	Columbia Asia	\N	\N	\N	India	\N	\N	\N	{"Psychiatry","Anesthesiology","Cardiology"}	\N	\N	2025-10-11 19:29:57.18291	\N	\N
10	Kokilaben Hospital	\N	\N	\N	India	\N	\N	\N	{"Anesthesiology","Cardiology","Neurology"}	\N	\N	2025-10-11 19:29:57.244859	\N	\N
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.job_applications (id, job_id, user_id, cover_letter, status, applied_at) FROM stdin;
1	1	30	\N	pending	2025-10-11 20:45:29.458287
2	1	29	\N	pending	2025-10-12 04:21:25.419454
11	28	51	I am interested in the Senior Cardiologist position. With over 8 years of experience in interventional cardiology, I believe I would be a great fit for your team.	reviewed	2025-10-07 07:27:56.431317
12	29	52	I am applying for the Pediatrician night shift position. I have 4 years of pediatric emergency experience and am comfortable with night shift work.	shortlisted	2025-10-05 07:27:56.431317
13	30	55	I am interested in the Orthopedic Surgeon consultant position. I have 9 years of experience including fellowship in joint replacement surgery.	pending	2025-10-10 07:27:56.431317
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jobs (id, title, hospital_id, hospital_name, specialty, location, state, city, experience_required, salary_range, job_type, description, requirements, posted_by, is_active, posted_at) FROM stdin;
1	Senior Cardiologist	\N	Fortis Hospital	Cardiology	Jaipur	\N	\N	4 years	\N	Full-time	We are looking for an experienced Senior Cardiologist to join our team at Fortis Hospital.	MBBS, MD in Cardiology, valid medical license	\N	t	2025-10-11 19:34:18.113579
2	Pediatric Specialist	\N	Apollo Hospital	Neurology	Delhi	\N	\N	8 years	\N	Part-time	We are looking for an experienced Pediatric Specialist to join our team at Apollo Hospital.	MBBS, MS in Neurology, valid medical license	\N	t	2025-10-11 19:34:18.174668
3	Consultant Surgeon	\N	AIIMS	Orthopedics	Mumbai	\N	\N	5 years	\N	Contract	We are looking for an experienced Consultant Surgeon to join our team at AIIMS.	MBBS, MD in Orthopedics, valid medical license	\N	t	2025-10-11 19:34:18.235194
4	Radiologist	\N	Max Hospital	Pediatrics	Bangalore	\N	\N	9 years	\N	Full-time	We are looking for an experienced Radiologist to join our team at Max Hospital.	MBBS, MS in Pediatrics, valid medical license	\N	t	2025-10-11 19:34:18.293098
5	Emergency Medicine Physician	\N	Manipal Hospital	Dermatology	Chennai	\N	\N	11 years	\N	Part-time	We are looking for an experienced Emergency Medicine Physician to join our team at Manipal Hospital.	MBBS, MD in Dermatology, valid medical license	\N	t	2025-10-11 19:34:18.35159
6	Oncologist	\N	Medanta	Radiology	Kolkata	\N	\N	8 years	\N	Contract	We are looking for an experienced Oncologist to join our team at Medanta.	MBBS, MS in Radiology, valid medical license	\N	t	2025-10-11 19:34:18.409942
7	Neurologist	\N	Narayana Health	General Surgery	Hyderabad	\N	\N	9 years	\N	Full-time	We are looking for an experienced Neurologist to join our team at Narayana Health.	MBBS, MD in General Surgery, valid medical license	\N	t	2025-10-11 19:34:18.468154
8	Anesthesiologist	\N	Cloudnine Hospital	Oncology	Pune	\N	\N	12 years	\N	Part-time	We are looking for an experienced Anesthesiologist to join our team at Cloudnine Hospital.	MBBS, MS in Oncology, valid medical license	\N	t	2025-10-11 19:34:18.526784
9	Dermatologist	\N	Columbia Asia	Psychiatry	Ahmedabad	\N	\N	4 years	\N	Contract	We are looking for an experienced Dermatologist to join our team at Columbia Asia.	MBBS, MD in Psychiatry, valid medical license	\N	t	2025-10-11 19:34:18.588045
10	Orthopedic Surgeon	\N	Kokilaben Hospital	Anesthesiology	Kota	\N	\N	8 years	\N	Full-time	We are looking for an experienced Orthopedic Surgeon to join our team at Kokilaben Hospital.	MBBS, MS in Anesthesiology, valid medical license	\N	t	2025-10-11 19:34:18.647332
11	Psychiatrist	\N	Fortis Hospital	Cardiology	Jaipur	\N	\N	3 years	\N	Part-time	We are looking for an experienced Psychiatrist to join our team at Fortis Hospital.	MBBS, MD in Cardiology, valid medical license	\N	t	2025-10-11 19:34:18.706421
12	General Physician	\N	Apollo Hospital	Neurology	Delhi	\N	\N	11 years	\N	Contract	We are looking for an experienced General Physician to join our team at Apollo Hospital.	MBBS, MS in Neurology, valid medical license	\N	t	2025-10-11 19:34:18.764181
13	Critical Care Specialist	\N	AIIMS	Orthopedics	Mumbai	\N	\N	9 years	\N	Full-time	We are looking for an experienced Critical Care Specialist to join our team at AIIMS.	MBBS, MD in Orthopedics, valid medical license	\N	t	2025-10-11 19:34:18.822583
14	Pathologist	\N	Max Hospital	Pediatrics	Bangalore	\N	\N	7 years	\N	Part-time	We are looking for an experienced Pathologist to join our team at Max Hospital.	MBBS, MS in Pediatrics, valid medical license	\N	t	2025-10-11 19:34:18.880715
15	ENT Specialist	\N	Manipal Hospital	Dermatology	Chennai	\N	\N	5 years	\N	Contract	We are looking for an experienced ENT Specialist to join our team at Manipal Hospital.	MBBS, MD in Dermatology, valid medical license	\N	t	2025-10-11 19:34:18.938654
16	Gynecologist	\N	Medanta	Radiology	Kolkata	\N	\N	3 years	\N	Full-time	We are looking for an experienced Gynecologist to join our team at Medanta.	MBBS, MS in Radiology, valid medical license	\N	t	2025-10-11 19:34:18.996817
17	Urologist	\N	Narayana Health	General Surgery	Hyderabad	\N	\N	7 years	\N	Part-time	We are looking for an experienced Urologist to join our team at Narayana Health.	MBBS, MD in General Surgery, valid medical license	\N	t	2025-10-11 19:34:19.053901
18	Nephrologist	\N	Cloudnine Hospital	Oncology	Pune	\N	\N	10 years	\N	Contract	We are looking for an experienced Nephrologist to join our team at Cloudnine Hospital.	MBBS, MS in Oncology, valid medical license	\N	t	2025-10-11 19:34:19.111757
19	Gastroenterologist	\N	Columbia Asia	Psychiatry	Ahmedabad	\N	\N	5 years	\N	Full-time	We are looking for an experienced Gastroenterologist to join our team at Columbia Asia.	MBBS, MD in Psychiatry, valid medical license	\N	t	2025-10-11 19:34:19.169694
20	Endocrinologist	\N	Kokilaben Hospital	Anesthesiology	Kota	\N	\N	12 years	\N	Part-time	We are looking for an experienced Endocrinologist to join our team at Kokilaben Hospital.	MBBS, MS in Anesthesiology, valid medical license	\N	t	2025-10-11 19:34:19.227987
21	Test Job KSKod9	\N	Apollo Hospital	Cardiology	\N	Maharashtra	Mumbai	3-5 years	₹8-12 LPA	full-time	Seeking experienced cardiologist for our cardiology department	MBBS, MD in Cardiology, 3+ years experience	29	t	2025-10-12 04:43:40.816737
22	Consultant Cardiologist	\N	Apollo Hospitals	Cardiology	Mumbai	Maharashtra	Mumbai	5+ years	₹15-25 LPA	full-time	Seeking experienced cardiologist for tertiary care hospital. Expertise in interventional cardiology preferred.	\N	51	t	2025-10-12 06:35:24.420909
23	Junior Resident - Emergency Medicine	\N	AIIMS Delhi	Emergency Medicine	Delhi NCR	Delhi	New Delhi	0-2 years	₹6-8 LPA	full-time	Immediate opening for junior resident in busy emergency department. 24x7 rotational duties.	\N	51	t	2025-10-12 06:35:24.420909
24	Pediatrician - Consultant Level	\N	Fortis Healthcare	Pediatrics	Bangalore	Karnataka	Bangalore	3-5 years	₹10-15 LPA	part-time	Multi-specialty hospital requires pediatrician with NICU experience. Flexible timings available.	\N	52	t	2025-10-12 06:35:24.420909
25	Radiologist - Diagnostic Imaging	\N	Ruby Hall Clinic	Radiology	Pune	Maharashtra	Pune	2-4 years	₹12-18 LPA	full-time	Looking for radiologist skilled in MRI, CT interpretation. Good work-life balance.	\N	55	t	2025-10-12 06:35:24.420909
26	General Surgeon	\N	Care Hospitals	Surgery	Hyderabad	Telangana	Hyderabad	5+ years	₹18-28 LPA	full-time	Established hospital seeks general surgeon for OPD and emergency surgeries.	\N	57	t	2025-10-12 06:35:24.420909
27	Medical Officer - Primary Health Centre	\N	Govt Primary Health Centre	General Medicine	Rajasthan (Rural)	Rajasthan	Jaipur	0-1 year	₹5-7 LPA	full-time	Government PHC requires MBBS doctor for rural posting. Accommodation provided.	\N	51	t	2025-10-12 06:35:24.420909
28	Senior Cardiologist	\N	Apollo Hospitals	Cardiology	Chennai, Tamil Nadu	Tamil Nadu	Chennai	5-10 years	₹15-25 LPA	full-time	Seeking experienced Cardiologist for our cardiac care unit. Must be proficient in interventional cardiology procedures.	MD/DM in Cardiology, Valid medical license, Experience in interventional procedures	51	t	2025-10-12 07:24:07.715791
29	Pediatrician - Night Shift	\N	Fortis Hospital	Pediatrics	Bangalore, Karnataka	Karnataka	Bangalore	2-5 years	₹8-12 LPA	full-time	Looking for dedicated Pediatrician for night shift coverage in our pediatric emergency department.	MD Pediatrics, BLS/PALS certification, Good communication skills	52	t	2025-10-12 07:24:07.715791
30	Orthopedic Surgeon - Consultant	\N	Max Super Speciality Hospital	Orthopedics	New Delhi	Delhi	New Delhi	7+ years	₹20-35 LPA	full-time	Consultant Orthopedic Surgeon for joint replacement and trauma surgery. Teaching responsibilities included.	MS/DNB Orthopedics, Fellowship in Arthroplasty preferred, Minimum 7 years experience	55	t	2025-10-12 07:24:07.715791
\.


--
-- Data for Name: masterclass_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.masterclass_bookings (id, user_id, masterclass_id, booked_at) FROM stdin;
1	30	1	2025-10-12 02:28:05.614023
2	51	6	2025-10-12 06:37:47.322208
3	52	7	2025-10-12 06:37:47.322208
4	53	8	2025-10-12 06:37:47.322208
5	55	9	2025-10-12 06:37:47.322208
6	56	8	2025-10-12 06:37:47.322208
7	57	6	2025-10-12 06:37:47.322208
8	51	10	2025-10-02 07:27:09.435935
9	52	11	2025-10-04 07:27:09.435935
10	55	12	2025-10-07 07:27:09.435935
11	53	8	2025-09-27 07:27:09.435935
12	56	10	2025-09-30 07:27:09.435935
\.


--
-- Data for Name: masterclasses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.masterclasses (id, title, description, instructor, event_date, duration, max_participants, current_participants, price, location, thumbnail_image, is_active, created_at) FROM stdin;
2	Case Discussion: Complex Neurology Cases	Expert-led case discussion: complex neurology cases with renowned specialists	Dr. Priya Patel	2025-10-25 11:00:00.572	151	70	8	4648	\N	\N	t	2025-10-11 19:33:44.605202
3	Workshop: Laparoscopic Techniques	Expert-led workshop: laparoscopic techniques with renowned specialists	Dr. Amit Singh	2025-11-01 12:00:00.632	167	82	14	2448	\N	\N	t	2025-10-11 19:33:44.664643
4	Seminar: Cancer Immunotherapy	Expert-led seminar: cancer immunotherapy with renowned specialists	Dr. Neha Kumar	2025-11-08 13:00:00.691	123	53	2	4182	\N	\N	t	2025-10-11 19:33:44.724438
5	Conference: Pediatric Care Excellence	Expert-led conference: pediatric care excellence with renowned specialists	Dr. Vikram Gupta	2025-11-15 14:00:00.751	163	61	11	4219	\N	\N	t	2025-10-11 19:33:44.783933
1	Live Surgery Demonstration - Cardiac Bypass	Expert-led live surgery demonstration - cardiac bypass with renowned specialists	Dr. Rajesh Sharma	2025-10-18 10:00:00.497	157	61	18	2906	\N	\N	t	2025-10-11 19:33:44.532273
6	Live Surgery Demonstration: Laparoscopic Cholecystectomy	Watch and learn from a live laparoscopic surgery with real-time commentary and Q&A session.	Dr. Ramesh Gupta	2025-11-15 10:00:00	120	50	0	5999	\N	\N	t	2025-10-12 06:31:20.00547
7	ICU Management Masterclass	Interactive session on critical care management, ventilator settings, and managing complex ICU patients.	Dr. Meena Iyer	2025-11-20 14:00:00	90	100	0	4999	\N	\N	t	2025-10-12 06:31:20.00547
8	Radiology Case Discussions	Learn to interpret complex radiological images through interactive case-based discussions.	Dr. Karthik Rao	2025-11-25 16:00:00	60	200	0	0	\N	\N	t	2025-10-12 06:31:20.00547
9	Dermatology: Pattern Recognition	Master the art of diagnosing skin conditions through pattern recognition and clinical correlation.	Dr. Anjali Desai	2025-12-01 11:00:00	75	80	0	3499	\N	\N	t	2025-10-12 06:31:20.00547
10	Advanced Wound Care and Management	Comprehensive workshop on modern wound healing techniques, dressing selection, and negative pressure wound therapy for complex cases.	Dr. Priya Sharma	2025-11-30 10:00:00	180	50	0	2999	Online - Zoom	\N	t	2025-10-12 07:21:46.500929
11	Emergency Medicine: Trauma Life Support	Hands-on training in advanced trauma life support, rapid assessment, and critical interventions in emergency settings.	Dr. Rajesh Kumar	2025-12-15 09:00:00	240	30	0	5499	Medical College Auditorium, Mumbai	\N	t	2025-10-12 07:21:46.500929
12	Cardiology Update: Latest Guidelines 2025	Review of latest ACC/AHA guidelines for cardiovascular disease management, including new treatment protocols and evidence-based practices.	Dr. Amit Patel	2025-12-20 15:00:00	120	100	0	0	Online - Google Meet	\N	t	2025-10-12 07:21:46.500929
\.


--
-- Data for Name: medical_voice_contacts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.medical_voice_contacts (id, voice_id, name, designation, phone, email, is_primary, visible, created_at) FROM stdin;
\.


--
-- Data for Name: medical_voice_gathering_joins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.medical_voice_gathering_joins (id, voice_id, user_id, status, remarks, joined_at) FROM stdin;
\.


--
-- Data for Name: medical_voice_supporters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.medical_voice_supporters (id, voice_id, user_id, motivation_note, joined_at) FROM stdin;
\.


--
-- Data for Name: medical_voice_updates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.medical_voice_updates (id, voice_id, update_title, update_body, created_at, notify_supporters) FROM stdin;
\.


--
-- Data for Name: medical_voices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.medical_voices (id, title, slug, short_description, description, category, banner_image, related_documents, related_images, concerned_authority, target_department, media_contacts, visibility, status, supporters_count, has_gathering, gathering_date, gathering_location, gathering_address, gathering_city, gathering_state, gathering_pin, gathering_map_link, gathering_notes, creator_id, created_at, updated_at) FROM stdin;
1	Better Work Hours for Resident Doctors	better-work-hours-resident-doctors	Campaign for implementing maximum 48-hour work weeks for resident doctors	Comprehensive campaign details about work hour limits for resident doctors across India. This campaign aims to ensure better health and productivity of our medical professionals.	Workplace Safety	\N	\N	\N	Ministry of Health, Medical Council	Labour & Employment	\N	public	active	0	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-12 08:13:11.524777	2025-10-12 08:13:11.524777
\.


--
-- Data for Name: module_tests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.module_tests (id, module_id, title, total_questions, passing_score, duration, created_at) FROM stdin;
1	8	Clinical Skills Assessment	10	70	15	2025-10-12 06:33:10.994999
2	13	ECG & Cardiology Test	10	75	20	2025-10-12 06:33:10.994999
3	17	Pediatric Emergency Test	8	70	15	2025-10-12 06:33:10.994999
5	26	Research & Statistics Quiz	8	70	20	2025-10-12 06:33:10.994999
4	22	Surgical Techniques Quiz	10	80	25	2025-10-12 06:33:10.994999
6	30	ECG and Biomarkers Assessment	10	70	20	2025-10-12 07:14:46.263194
7	32	Heart Failure and Interventions Final Assessment	10	70	25	2025-10-12 07:14:46.263194
8	35	ECG Assessment Quiz	5	70	15	2025-10-12 07:19:48.696431
9	39	Research Methods Quiz	5	70	20	2025-10-12 07:19:48.696431
10	43	Medical Ethics Quiz	5	70	20	2025-10-12 07:19:48.696431
\.


--
-- Data for Name: npa_automation; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.npa_automation (id, opt_in_id, user_id, month, year, generated_pdf_url, status, sent_date, last_error, template_used, created_at) FROM stdin;
\.


--
-- Data for Name: npa_opt_ins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.npa_opt_ins (id, user_id, doctor_profile_id, is_active, preferred_day, template_id, delivery_email, delivery_whatsapp, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: npa_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.npa_templates (id, title, description, html_template, placeholders, is_active, created_at, updated_at) FROM stdin;
1	Test NPA Certificate zqDl0C		<div><h1>Certificate</h1><p>Dr. {{name}} - {{designation}}</p><p>Month: {{month}}</p></div>	{name,designation,month}	t	2025-10-12 10:57:31.881181	2025-10-12 10:57:31.881181
\.


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quiz_attempts (id, user_id, quiz_id, score, total_questions, time_taken, passed, certificate_issued, attempted_at) FROM stdin;
9	51	6	85	20	720	t	f	2025-10-12 06:38:17.942161
10	52	7	78	15	480	t	f	2025-10-12 06:38:17.942161
11	53	9	92	15	350	t	f	2025-10-12 06:38:17.942161
12	54	6	65	20	850	f	f	2025-10-12 06:38:17.942161
13	55	8	88	12	580	t	f	2025-10-12 06:38:17.942161
14	56	9	76	15	420	t	f	2025-10-12 06:38:17.942161
15	57	7	82	15	510	t	f	2025-10-12 06:38:17.942161
16	58	6	70	20	790	t	f	2025-10-12 06:38:17.942161
\.


--
-- Data for Name: quiz_leaderboard; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quiz_leaderboard (id, quiz_id, user_id, total_score, avg_time, rank, certificate_url, created_at) FROM stdin;
1	10	59	1	\N	1	\N	2025-10-12 06:53:36.794397
\.


--
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quiz_questions (id, quiz_id, question_text, correct_option, order_index, image, marks, options) FROM stdin;
2	2	What is the normal resting heart rate for adults?	B	1	\N	1	{}
3	2	Which chamber of the heart pumps blood to the lungs?	D	2	\N	1	{}
4	2	What does ECG stand for?	A	3	\N	1	{}
5	2	Which blood vessel carries oxygenated blood from lungs to heart?	B	4	\N	1	{}
6	2	What is the medical term for high blood pressure?	B	5	\N	1	{}
7	3	At what age does a child typically start walking?	C	1	\N	1	{}
8	3	What is the recommended vaccine at birth?	B	2	\N	1	{}
9	3	Normal respiratory rate for a newborn?	C	3	\N	1	{}
10	3	Most common cause of fever in children?	A	4	\N	1	{}
11	4	What is the golden hour in trauma surgery?	B	1	\N	1	{}
12	4	Most common type of hernia?	C	2	\N	1	{}
13	4	What does NPO mean before surgery?	B	3	\N	1	{}
14	4	Appendix location in abdomen?	C	4	\N	1	{}
15	5	What is the most common type of stroke?	B	1	\N	1	{}
16	5	Which cranial nerve controls vision?	B	2	\N	1	{}
17	5	Normal intracranial pressure range?	B	3	\N	1	{}
18	10	Which chamber of the heart has the thickest myocardial wall?	D	1	\N	1	{"A": "Right Atrium", "B": "Left Atrium", "C": "Right Ventricle", "D": "Left Ventricle"}
19	10	What is the normal ejection fraction of a healthy heart?	B	2	\N	1	{"A": "35-45%", "B": "55-70%", "C": "75-85%", "D": "85-95%"}
20	10	Which cardiac marker rises first after an acute MI?	C	3	\N	1	{"A": "Troponin I", "B": "CK-MB", "C": "Myoglobin", "D": "LDH"}
21	10	What is the first-line treatment for stable angina?	B	4	\N	1	{"A": "ACE inhibitors", "B": "Beta blockers", "C": "Nitrates", "D": "Calcium channel blockers"}
22	10	Which valve is most commonly affected in rheumatic heart disease?	B	5	\N	1	{"A": "Aortic valve", "B": "Mitral valve", "C": "Tricuspid valve", "D": "Pulmonary valve"}
23	10	What does ST elevation in ECG typically indicate?	B	6	\N	1	{"A": "Old MI", "B": "Acute MI", "C": "Pericarditis", "D": "Ventricular hypertrophy"}
24	10	Normal resting heart rate in adults is:	B	7	\N	1	{"A": "40-60 bpm", "B": "60-100 bpm", "C": "100-120 bpm", "D": "120-140 bpm"}
25	10	Which drug class is contraindicated in decompensated heart failure?	D	8	\N	1	{"A": "ACE inhibitors", "B": "Beta blockers", "C": "Diuretics", "D": "NSAIDs"}
26	10	The pacemaker of the heart is:	B	9	\N	1	{"A": "AV node", "B": "SA node", "C": "Bundle of His", "D": "Purkinje fibers"}
27	10	Which investigation is gold standard for coronary artery disease?	C	10	\N	1	{"A": "ECG", "B": "Echocardiography", "C": "Coronary angiography", "D": "Stress test"}
28	6	Which of the following is the most common cause of community-acquired pneumonia?	A	1	\N	1	{"A":"Streptococcus pneumoniae","B":"Haemophilus influenzae","C":"Mycoplasma pneumoniae","D":"Klebsiella pneumoniae"}
29	6	What is the first-line investigation for suspected DVT?	C	2	\N	1	{"A":"D-dimer","B":"Venography","C":"Doppler ultrasound","D":"CT scan"}
30	6	HbA1c of 7.5% corresponds to average blood glucose of approximately:	C	3	\N	1	{"A":"126 mg/dL","B":"154 mg/dL","C":"169 mg/dL","D":"183 mg/dL"}
31	6	Which medication is contraindicated in acute gout?	C	4	\N	1	{"A":"NSAIDs","B":"Colchicine","C":"Allopurinol","D":"Corticosteroids"}
32	6	The antidote for warfarin overdose is:	B	5	\N	1	{"A":"Protamine sulfate","B":"Vitamin K","C":"Fresh frozen plasma","D":"Prothrombin complex concentrate"}
33	6	Which finding is most specific for rheumatoid arthritis?	B	6	\N	1	{"A":"Morning stiffness >1 hour","B":"Anti-CCP antibodies","C":"Rheumatoid factor","D":"Symmetric joint involvement"}
34	6	Normal anion gap metabolic acidosis is seen in:	B	7	\N	1	{"A":"Diabetic ketoacidosis","B":"Renal tubular acidosis","C":"Lactic acidosis","D":"Methanol poisoning"}
35	6	What is the target LDL cholesterol in patients with established CAD?	C	8	\N	1	{"A":"<100 mg/dL","B":"<70 mg/dL","C":"<55 mg/dL","D":"<130 mg/dL"}
36	6	Which organism causes subacute bacterial endocarditis most commonly?	B	9	\N	1	{"A":"Staphylococcus aureus","B":"Streptococcus viridans","C":"Enterococcus","D":"HACEK organisms"}
37	6	Hypokalemia is a common side effect of:	C	10	\N	1	{"A":"ACE inhibitors","B":"Spironolactone","C":"Furosemide","D":"Amiloride"}
38	6	Which is the first-line treatment for H. pylori eradication?	B	11	\N	1	{"A":"Single antibiotic","B":"Triple therapy (PPI + 2 antibiotics)","C":"Bismuth alone","D":"H2 blocker + antibiotic"}
39	6	Osmotic gap is useful in diagnosing:	C	12	\N	1	{"A":"Hypernatremia","B":"Hypokalemia","C":"Diarrhea etiology","D":"Renal failure"}
40	6	Most common cause of hypercalcemia in outpatient setting:	A	13	\N	1	{"A":"Primary hyperparathyroidism","B":"Malignancy","C":"Vitamin D toxicity","D":"Sarcoidosis"}
41	6	Which test confirms Addison disease?	B	14	\N	1	{"A":"Random cortisol","B":"ACTH stimulation test","C":"Dexamethasone suppression","D":"24-hour urinary cortisol"}
42	6	Charcot triad is seen in:	A	15	\N	1	{"A":"Cholangitis","B":"Appendicitis","C":"Pancreatitis","D":"Cholecystitis"}
43	6	Which drug prolongs QT interval?	B	16	\N	1	{"A":"Metoprolol","B":"Azithromycin","C":"Metformin","D":"Lisinopril"}
44	6	First-line treatment for acute gout attack:	B	17	\N	1	{"A":"Allopurinol","B":"NSAIDs or colchicine","C":"Probenecid","D":"Corticosteroids only"}
45	6	Cushing syndrome is characterized by:	C	18	\N	1	{"A":"Low cortisol","B":"High ACTH always","C":"Central obesity and striae","D":"Hypotension"}
46	6	Target blood pressure in diabetic patients:	B	19	\N	1	{"A":"<140/90","B":"<130/80","C":"<120/70","D":"<150/90"}
47	6	Which vitamin deficiency causes megaloblastic anemia?	C	20	\N	1	{"A":"Vitamin C","B":"Vitamin D","C":"Vitamin B12","D":"Vitamin K"}
48	7	Mechanism of action of aspirin:	A	1	\N	1	{"A":"COX-1 and COX-2 inhibition","B":"Platelet aggregation only","C":"Thromboxane synthesis only","D":"Factor X inhibition"}
49	7	Beta blocker contraindicated in asthma:	D	2	\N	1	{"A":"Metoprolol","B":"Carvedilol","C":"Propranolol","D":"All of above"}
50	7	ACE inhibitor side effect:	D	3	\N	1	{"A":"Dry cough","B":"Hyperkalemia","C":"Angioedema","D":"All of above"}
51	7	Antidote for benzodiazepine overdose:	B	4	\N	1	{"A":"Naloxone","B":"Flumazenil","C":"N-acetylcysteine","D":"Atropine"}
52	7	Which statin is most potent?	B	5	\N	1	{"A":"Atorvastatin","B":"Rosuvastatin","C":"Simvastatin","D":"Pravastatin"}
53	7	Metformin mechanism:	B	6	\N	1	{"A":"Insulin secretion","B":"Decreased hepatic gluconeogenesis","C":"Insulin sensitivity only","D":"Alpha-glucosidase inhibition"}
54	7	Drug causing gingival hyperplasia:	D	7	\N	1	{"A":"Amlodipine","B":"Phenytoin","C":"Cyclosporine","D":"All of above"}
55	7	Digoxin toxicity sign:	D	8	\N	1	{"A":"Yellow vision","B":"Arrhythmias","C":"GI symptoms","D":"All of above"}
56	7	First-line antibiotic for UTI:	A	9	\N	1	{"A":"Nitrofurantoin","B":"Ciprofloxacin","C":"Amoxicillin","D":"Gentamicin"}
57	7	Warfarin monitoring:	B	10	\N	1	{"A":"aPTT","B":"INR","C":"Bleeding time","D":"Platelet count"}
58	7	Which antihypertensive is safe in pregnancy?	C	11	\N	1	{"A":"ACE inhibitors","B":"ARBs","C":"Methyldopa","D":"Lisinopril"}
59	7	P450 enzyme inducer:	A	12	\N	1	{"A":"Rifampicin","B":"Ketoconazole","C":"Erythromycin","D":"Cimetidine"}
60	7	Drug causing SLE-like syndrome:	D	13	\N	1	{"A":"Hydralazine","B":"Procainamide","C":"Isoniazid","D":"All of above"}
61	7	Calcium channel blocker for rate control:	C	14	\N	1	{"A":"Amlodipine","B":"Nifedipine","C":"Diltiazem","D":"Felodipine"}
62	7	Antidote for heparin:	B	15	\N	1	{"A":"Vitamin K","B":"Protamine sulfate","C":"Fresh frozen plasma","D":"Platelets"}
63	8	Murphy sign is positive in:	A	1	\N	1	{"A":"Cholecystitis","B":"Appendicitis","C":"Pancreatitis","D":"Cholangitis"}
64	8	Kernig sign indicates:	B	2	\N	1	{"A":"Appendicitis","B":"Meningitis","C":"Peritonitis","D":"Cholecystitis"}
65	8	Virchow triad for thrombosis includes:	A	3	\N	1	{"A":"Stasis, hypercoagulability, endothelial injury","B":"Fever, rash, lymphadenopathy","C":"Cough, fever, dyspnea","D":"Chest pain, dyspnea, syncope"}
66	8	Pleuritic chest pain suggests:	B	4	\N	1	{"A":"MI","B":"Pulmonary embolism","C":"GERD","D":"Costochondritis"}
67	8	What does pulsus paradoxus indicate?	A	5	\N	1	{"A":"Cardiac tamponade","B":"Hypertension","C":"Aortic stenosis","D":"Mitral regurgitation"}
68	8	Cullen sign indicates:	B	6	\N	1	{"A":"Cholecystitis","B":"Acute pancreatitis","C":"Appendicitis","D":"Diverticulitis"}
69	8	Rovsing sign is seen in:	A	7	\N	1	{"A":"Appendicitis","B":"Cholecystitis","C":"Pancreatitis","D":"Diverticulitis"}
70	8	Clubbing is NOT seen in:	D	8	\N	1	{"A":"Lung cancer","B":"Cirrhosis","C":"Cyanotic heart disease","D":"Diabetes mellitus"}
71	8	Homan sign tests for:	B	9	\N	1	{"A":"Appendicitis","B":"DVT","C":"Meningitis","D":"Cholecystitis"}
72	8	Aortic regurgitation murmur:	B	10	\N	1	{"A":"Systolic ejection murmur","B":"Early diastolic decrescendo","C":"Pansystolic murmur","D":"Mid-diastolic rumble"}
73	8	Kussmaul breathing indicates:	B	11	\N	1	{"A":"Respiratory alkalosis","B":"Metabolic acidosis","C":"Pulmonary embolism","D":"Asthma"}
74	8	What does shifting dullness indicate?	A	12	\N	1	{"A":"Ascites","B":"Pneumothorax","C":"Pleural effusion","D":"Pneumonia"}
75	11	Test Question 1	A	0	\N	1	{"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}
76	11	Test Question 2	B	1	\N	1	{"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}
\.


--
-- Data for Name: quiz_responses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quiz_responses (id, quiz_id, question_id, user_id, selected_option, is_correct, response_time, score, created_at) FROM stdin;
1	10	20	59	D	f	30	0	2025-10-12 06:55:17.421907
2	10	22	59	D	f	30	0	2025-10-12 06:56:28.070756
3	10	23	59	D	f	30	0	2025-10-12 06:57:03.659419
4	10	26	59	D	f	30	0	2025-10-12 06:58:49.331966
5	10	27	59	C	t	30	1	2025-10-12 06:59:24.887705
\.


--
-- Data for Name: quiz_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quiz_sessions (id, quiz_id, current_question, started_at, status, created_at) FROM stdin;
2	11	0	2025-10-12 07:45:54.08	running	2025-10-12 07:45:54.112498
3	11	0	2025-10-12 07:46:54.058	running	2025-10-12 07:46:54.090928
4	11	0	2025-10-12 07:47:54.062	running	2025-10-12 07:47:54.094043
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quizzes (id, title, description, passing_score, status, created_at, category, difficulty, type, total_questions, question_time, duration, entry_fee, reward_info, certificate_type, start_time, end_time, updated_at) FROM stdin;
1	Cardiology Basics	Test your knowledge in Cardiology	60	active	2025-10-11 19:33:44.90715	\N	\N	\N	0	30	\N	0	\N	\N	\N	\N	2025-10-11 21:24:00.564607
2	Cardiology Basics	Test your knowledge in Cardiology	60	active	2025-10-11 19:37:56.905376	\N	\N	\N	0	30	\N	0	\N	\N	\N	\N	2025-10-11 21:24:00.564607
3	Pediatric Assessment	Test your knowledge in Pediatrics	60	active	2025-10-11 19:37:57.292708	\N	\N	\N	0	30	\N	0	\N	\N	\N	\N	2025-10-11 21:24:00.564607
4	Surgical Protocols	Test your knowledge in General Surgery	60	active	2025-10-11 19:37:57.597423	\N	\N	\N	0	30	\N	0	\N	\N	\N	\N	2025-10-11 21:24:00.564607
5	Neurology Diagnosis	Test your knowledge in Neurology	60	active	2025-10-11 19:37:57.898147	\N	\N	\N	0	30	\N	0	\N	\N	\N	\N	2025-10-11 21:24:00.564607
6	General Medicine MCQ Challenge	Test your general medicine knowledge with this comprehensive quiz	70	active	2025-10-12 06:34:43.817048	General Medicine	intermediate	practice	20	45	900	0	\N	\N	\N	\N	2025-10-12 06:34:43.817048
7	Pharmacology Rapid Fire	Quick quiz on essential drug mechanisms and interactions	75	active	2025-10-12 06:34:43.817048	Pharmacology	advanced	practice	15	40	600	0	\N	\N	\N	\N	2025-10-12 06:34:43.817048
8	Clinical Diagnosis Quiz	Case-based questions to test your diagnostic skills	70	active	2025-10-12 06:34:43.817048	Clinical Skills	intermediate	practice	12	60	720	0	\N	\N	\N	\N	2025-10-12 06:34:43.817048
9	Anatomy Basics	Fundamental anatomy questions for medical students	60	active	2025-10-12 06:34:43.817048	Anatomy	beginner	free	15	30	450	0	\N	\N	\N	\N	2025-10-12 06:34:43.817048
10	Live Medical Quiz - Cardiology	Competitive quiz on cardiology basics. Join now and compete with other medical professionals!	70	active	2025-10-12 06:39:49.093986	Cardiology	intermediate	practice	10	30	300	0	\N	\N	2025-10-12 06:41:49.093986	2025-10-12 06:49:49.093986	2025-10-12 06:39:49.093986
11	Auto-Start Test Quiz	This quiz should auto-start immediately	60	active	2025-10-12 07:45:41.066791	Test	beginner	live	0	10	\N	0	\N	\N	2025-10-12 07:44:41.066791	\N	2025-10-12 07:45:41.066791
\.


--
-- Data for Name: research_service_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.research_service_requests (id, user_id, service_type, title, description, status, assigned_to, estimated_cost, completed_at, created_at, updated_at) FROM stdin;
1	51	article_writing	Systematic Review on Diabetes Management	Need help writing a systematic review on latest diabetes management protocols for journal publication	in_progress	\N	25000	\N	2025-10-12 06:35:57.499981	2025-10-12 06:35:57.499981
2	52	thesis_support	MD Thesis Statistical Analysis	Require statistical analysis support for my MD thesis on hypertension outcomes	pending	\N	15000	\N	2025-10-12 06:35:57.499981	2025-10-12 06:35:57.499981
3	55	statistical_consulting	Clinical Trial Data Analysis	Need expert consultation for analyzing Phase 2 clinical trial data	in_progress	\N	30000	\N	2025-10-12 06:35:57.499981	2025-10-12 06:35:57.499981
4	57	article_writing	Case Report Publication	Assistance needed for writing and submitting a rare case report	completed	\N	12000	\N	2025-10-12 06:35:57.499981	2025-10-12 06:35:57.499981
5	51	article_writing	Research Article on Novel Biomarkers in Heart Failure	Need assistance in writing a research article based on my clinical study data on NT-proBNP and Galectin-3 as prognostic markers in heart failure patients. Data analysis complete, need help with manuscript preparation for submission to Indian Heart Journal.	in_progress	\N	15000	\N	2025-10-02 07:25:30.834472	2025-10-12 07:25:30.834472
6	52	statistical_consulting	Statistical Analysis for Pediatric Nutrition Study	Require expert statistical consultation for analyzing data from a prospective cohort study on nutritional interventions in malnourished children. Need help with regression analysis and survival curves.	pending	\N	8000	\N	2025-10-09 07:25:30.834472	2025-10-12 07:25:30.834472
7	55	thesis_support	DM Thesis Support - Outcomes in Total Knee Replacement	Seeking comprehensive thesis support for my DM Orthopedics dissertation comparing outcomes of cemented vs cementless total knee replacement. Need help with literature review, methodology, and statistical analysis.	in_progress	\N	25000	\N	2025-09-12 07:25:30.834472	2025-10-12 07:25:30.834472
8	53	article_writing	Case Report Publication Support	Want to publish a rare case of Takotsubo cardiomyopathy in a young patient. Have all clinical data and images. Need help with writing and journal selection.	pending	\N	5000	\N	2025-10-07 07:25:30.834472	2025-10-12 07:25:30.834472
9	56	statistical_consulting	Power Calculation and Sample Size for RCT	Planning a randomized controlled trial on diabetes management interventions. Need consultation on appropriate sample size calculation and power analysis.	completed	\N	3000	\N	2025-09-22 07:25:30.834472	2025-10-12 07:25:30.834472
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.settings (id, key, value, category, description, updated_at) FROM stdin;
1	platform_name	DocsUniverse	platform	Platform display name	2025-10-12 06:18:47.670769
2	platform_tagline	Empowering Medical Professionals	platform	Platform tagline or subtitle	2025-10-12 06:18:47.670769
3	contact_email	support@docsuniverse.com	platform	Platform contact email address	2025-10-12 06:18:47.670769
4	contact_phone	+91 1234567890	platform	Platform contact phone number	2025-10-12 06:18:47.670769
5	whatsapp_api_key		whatsapp	BigTos WhatsApp API key	2025-10-12 06:18:47.670769
6	whatsapp_sender_number		whatsapp	WhatsApp sender number for notifications	2025-10-12 06:18:47.670769
7	certificate_title_font_size	48	certificates	Font size for certificate title	2025-10-12 06:18:47.670769
8	certificate_name_font_size	36	certificates	Font size for recipient name on certificate	2025-10-12 06:18:47.670769
9	enable_email_notifications	true	notifications	Enable email notifications for users	2025-10-12 06:18:47.670769
10	enable_whatsapp_notifications	true	notifications	Enable WhatsApp notifications for users	2025-10-12 06:18:47.670769
\.


--
-- Data for Name: test_questions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.test_questions (id, test_id, question_no, description, option_a, option_b, option_c, option_d, correct_answer, marks) FROM stdin;
1	1	1	What is the normal respiratory rate for an adult at rest?	8-10 breaths/min	12-20 breaths/min	22-28 breaths/min	30-35 breaths/min	B	1
2	1	2	Which position is best for examining the jugular venous pressure?	Supine at 0 degrees	Semi-recumbent at 45 degrees	Standing upright	Prone position	B	1
3	1	3	Normal oxygen saturation (SpO2) in a healthy adult is:	85-90%	90-95%	95-100%	100-105%	C	1
4	1	4	The correct sequence for abdominal examination is:	Percussion, Palpation, Auscultation, Inspection	Inspection, Auscultation, Percussion, Palpation	Auscultation, Inspection, Percussion, Palpation	Inspection, Palpation, Percussion, Auscultation	B	1
5	1	5	What is considered hypertension in adults?	BP > 120/80 mmHg	BP > 130/80 mmHg	BP > 140/90 mmHg	BP > 150/100 mmHg	C	1
6	1	6	Which pulse is most commonly used for checking heart rate?	Carotid pulse	Radial pulse	Femoral pulse	Dorsalis pedis pulse	B	1
7	1	7	Normal body temperature range for adults is:	35.5-36.5°C	36.5-37.5°C	37.5-38.5°C	38.5-39.5°C	B	1
8	1	8	What does SAMPLE stand for in history taking?	Signs, Allergies, Medications, Past, Last meal, Events	Symptoms, Age, Medical, Physical, Labs, Exam	Surgical, Allergic, Medical, Personal, Laboratory, Emergency	Social, Allergic, Medications, Psychiatric, Legal, Employment	A	1
9	1	9	The Glasgow Coma Scale maximum score is:	10	12	15	20	C	1
10	1	10	Which of the following is NOT part of the cardiovascular examination?	Inspection	Palpation	Auscultation	Transillumination	D	1
11	2	1	Normal PR interval duration is:	0.08-0.12 seconds	0.12-0.20 seconds	0.20-0.28 seconds	0.28-0.36 seconds	B	1
12	2	2	ST elevation in leads II, III, and aVF suggests:	Anterior MI	Lateral MI	Inferior MI	Posterior MI	C	1
13	2	3	The most common cause of atrial fibrillation is:	Hypertensive heart disease	Coronary artery disease	Rheumatic heart disease	Valvular heart disease	A	1
14	2	4	Normal QRS complex duration is:	Less than 0.06 seconds	Less than 0.12 seconds	Less than 0.20 seconds	Less than 0.30 seconds	B	1
15	2	5	Which lead is best for detecting right ventricular infarction?	Lead I	Lead V1	Lead V4R	Lead aVL	C	1
16	2	6	The classic ECG finding in pericarditis is:	Pathological Q waves	Widespread ST elevation	Deep S waves in V1-V3	Tall R waves in V5-V6	B	1
17	2	7	Torsades de pointes is associated with:	Short QT interval	Prolonged QT interval	Short PR interval	Wide QRS complex	B	1
18	2	8	First-degree AV block is characterized by:	PR interval > 0.20 seconds	Progressive PR prolongation	Dropped QRS complexes	Complete dissociation	A	1
19	2	9	The  normal heart rate for an adult is:	40-60 bpm	60-100 bpm	100-120 bpm	120-140 bpm	B	1
20	2	10	Which arrhythmia requires immediate cardioversion?	Sinus bradycardia	First-degree AV block	Ventricular fibrillation	Premature atrial contractions	C	1
21	3	1	The pediatric assessment triangle includes which three components?	ABC (Airway, Breathing, Circulation)	Appearance, Work of breathing, Circulation to skin	Vital signs, AVPU, GCS	Heart rate, Respiratory rate, Temperature	B	1
22	3	2	Normal respiratory rate for a 2-year-old child is:	10-20 breaths/min	20-30 breaths/min	30-40 breaths/min	40-50 breaths/min	B	1
23	3	3	The most common cause of respiratory distress in infants is:	Pneumonia	Bronchiolitis	Asthma	Foreign body aspiration	B	1
24	3	4	Appropriate fluid resuscitation bolus for pediatric shock is:	5 ml/kg over 30 minutes	10 ml/kg over 20 minutes	20 ml/kg over 10-15 minutes	50 ml/kg over 60 minutes	C	1
25	3	5	Signs of increased work of breathing include all EXCEPT:	Nasal flaring	Intercostal retractions	Head bobbing	Pink mucous membranes	D	1
26	3	6	The correct ET tube size for a 3-year-old child (uncuffed) is approximately:	3.5 mm	4.5 mm	5.5 mm	6.5 mm	B	1
27	3	7	What is the first-line medication for pediatric anaphylaxis?	Diphenhydramine	Epinephrine IM	Hydrocortisone IV	Salbutamol nebulizer	B	1
28	3	8	A 6-month-old with fever >38°C and ill appearance requires:	Observation only	Oral antibiotics	Full septic workup and IV antibiotics	Antipyretics and follow-up	C	1
29	4	1	The most commonly used suture for skin closure is:	Absorbable monofilament	Non-absorbable monofilament	Absorbable braided	Non-absorbable braided	B	1
30	4	2	Simple interrupted sutures are preferred over continuous sutures because:	They are faster to place	Removal of one suture doesn't compromise the entire wound	They use less suture material	They create less scarring	B	1
31	4	3	The ideal time for suture removal from the face is:	3-5 days	5-7 days	7-10 days	10-14 days	A	1
32	4	4	Which knot is most secure for surgical ties?	Single square knot	Surgeon's knot	Granny knot	Slip knot	B	1
33	4	5	Proper needle holder grip involves:	Thumb and ring finger in rings, index finger on shaft	Thumb and index finger in rings	Palm grip with all fingers	Pencil grip	A	1
34	4	6	The running subcuticular stitch is preferred for:	Deep fascial layers	Cosmetic skin closure	Tendon repair	Bone fixation	B	1
35	4	7	Wound dehiscence is most likely with:	Absorbable sutures in fascia	Early suture removal	Infection	All of the above	D	1
36	4	8	The correct direction for scalpel incision is:	Away from the surgeon	Toward the surgeon	Perpendicular to skin	At 45-degree angle	C	1
37	4	9	Hemostasis is best achieved by:	Direct pressure	Blind clamping	Cautery alone	Ice packs	A	1
38	4	10	The first step in wound closure is:	Start suturing immediately	Irrigate and debride	Apply antibiotic ointment	Close with tape	B	1
39	5	1	The gold standard for clinical research is:	Case series	Cohort study	Randomized controlled trial	Cross-sectional study	C	1
40	5	2	A p-value less than 0.05 indicates:	Clinical significance	Statistical significance	No relationship	Causation	B	1
41	5	3	Type I error occurs when:	We reject a true null hypothesis	We accept a false null hypothesis	The sample size is too small	The study is biased	A	1
42	5	4	Sensitivity of a test refers to:	True positive rate	True negative rate	False positive rate	False negative rate	A	1
43	5	5	The best measure of central tendency for skewed data is:	Mean	Median	Mode	Range	B	1
44	5	6	Confounding variable is best controlled by:	Increasing sample size	Randomization	Using t-test	Calculating p-value	B	1
45	5	7	Number needed to treat (NNT) is calculated as:	1 / Absolute risk reduction	1 / Relative risk	Odds ratio / Risk ratio	Sensitivity / Specificity	A	1
46	5	8	Which study design is best for rare diseases?	RCT	Cohort study	Case-control study	Cross-sectional study	C	1
47	6	1	What is the most specific cardiac biomarker for myocardial injury?	CK-MB	Troponin	Myoglobin	LDH	B	1
48	6	2	How long after MI does Troponin typically rise?	30 minutes	1-2 hours	3-4 hours	12 hours	C	1
49	6	3	Which is the EARLIEST biomarker to rise after MI?	Troponin	CK-MB	Myoglobin	BNP	C	1
50	6	4	ST elevation in leads II, III, and aVF indicates:	Anterior MI	Lateral MI	Inferior MI	Posterior MI	C	1
51	6	5	What does BNP measure?	Myocardial damage	Heart failure severity	Coronary stenosis	Arrhythmia risk	B	1
52	6	6	Normal PR interval duration is:	0.08-0.10 sec	0.12-0.20 sec	0.20-0.30 sec	0.30-0.40 sec	B	1
53	6	7	Which lead best shows septal MI?	V1-V2	V3-V4	V5-V6	II, III, aVF	A	1
54	6	8	Peak time for CK-MB after MI is:	4-6 hours	12 hours	24 hours	48 hours	C	1
55	6	9	Troponin remains elevated for how long?	24-48 hours	3-4 days	7-14 days	1 month	C	1
56	6	10	High-sensitivity troponin should be repeated at:	1-2 hours	4-6 hours	12 hours	24 hours	A	1
57	7	1	First-line treatment for acute decompensated heart failure is:	Beta blockers	Diuretics	ACE inhibitors	Digoxin	B	1
58	7	2	Which valve is most commonly affected in rheumatic heart disease?	Aortic	Mitral	Tricuspid	Pulmonary	B	1
59	7	3	NYHA Class III heart failure means:	No symptoms	Symptoms with moderate activity	Symptoms with minimal activity	Symptoms at rest	C	1
60	7	4	Preferred access site for PCI is:	Femoral artery	Radial artery	Brachial artery	Ulnar artery	B	1
61	7	5	Drug-eluting stents (DES) reduce:	Restenosis	Bleeding	MI risk	Death	A	1
62	7	6	No-reflow phenomenon is treated with:	Aspirin	Adenosine	Warfarin	Beta blockers	B	1
63	7	7	Normal ejection fraction is:	35-45%	45-55%	55-70%	70-85%	C	1
64	7	8	Contraindication for thrombolysis in STEMI:	Age > 75	Recent surgery (2 weeks)	Hypertension	Diabetes	B	1
65	7	9	Beta blockers in heart failure should be started when:	Patient is unstable	During acute phase	After stabilization	Never	C	1
66	7	10	Rotational atherectomy is used for:	Soft plaques	Calcified lesions	Thrombus	Dissection	B	1
67	8	1	What is the normal heart rate range in adults?	40-60 bpm	60-100 bpm	100-120 bpm	120-150 bpm	B	1
68	8	2	Which lead shows the lateral wall of the heart?	V1-V2	II, III, aVF	V5-V6	aVR	C	1
69	8	3	A prolonged QT interval increases risk of:	Atrial fibrillation	Heart block	Torsades de pointes	Sinus tachycardia	C	1
70	8	4	ST depression typically indicates:	Myocardial ischemia	Hyperkalemia	Bundle branch block	Normal variant	A	1
71	8	5	The normal QRS duration is:	0.04-0.06 sec	0.06-0.10 sec	0.10-0.12 sec	0.12-0.20 sec	B	1
72	9	1	What is the gold standard for clinical trials?	Case-control study	Cohort study	Randomized controlled trial	Cross-sectional study	C	1
73	9	2	Type I error in hypothesis testing means:	Accepting a false null hypothesis	Rejecting a true null hypothesis	Correct rejection	Correct acceptance	B	1
74	9	3	The p-value of 0.03 means:	Result is not significant	Result is significant at α=0.05	Result is highly significant	Sample size is too small	B	1
75	9	4	What is selection bias?	Incorrect data collection	Non-random sample selection	Measurement error	Publication bias	B	1
76	9	5	Intention-to-treat analysis includes:	Only compliant participants	All randomized participants	Per-protocol participants	Crossover participants	B	1
77	10	1	The principle of autonomy means:	Doctor decides treatment	Patient self-determination	Preventing harm	Doing good	B	1
78	10	2	Informed consent requires:	Only signature	Understanding and voluntariness	Family approval	Legal witness	B	1
79	10	3	Breach of confidentiality is justified when:	Patient has infectious disease posing public risk	Family asks for information	Insurance company requests	Never justified	A	1
80	10	4	Principle of beneficence means:	Respect autonomy	Do no harm	Act in patient best interest	Distribute resources fairly	C	1
81	10	5	A minor can consent to treatment when:	Never, always need parent	Gillick competent	Over 16 always	Emergency only	B	1
\.


--
-- Data for Name: test_responses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.test_responses (id, user_id, test_id, question_id, selected_option, is_correct, score, answered_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, phone, email, role, otp_code, otp_expiry, is_verified, created_at, updated_at) FROM stdin;
2	9810000001	\N	doctor	\N	\N	t	2025-10-11 19:29:55.095502	2025-10-11 19:29:55.095502
3	9810000002	\N	doctor	\N	\N	t	2025-10-11 19:29:55.206627	2025-10-11 19:29:55.206627
4	9810000003	\N	doctor	\N	\N	t	2025-10-11 19:29:55.267272	2025-10-11 19:29:55.267272
5	9810000004	\N	doctor	\N	\N	t	2025-10-11 19:29:55.327261	2025-10-11 19:29:55.327261
6	9810000005	\N	doctor	\N	\N	t	2025-10-11 19:29:55.387158	2025-10-11 19:29:55.387158
7	9810000006	\N	doctor	\N	\N	t	2025-10-11 19:29:55.454495	2025-10-11 19:29:55.454495
8	9810000007	\N	doctor	\N	\N	t	2025-10-11 19:29:55.51714	2025-10-11 19:29:55.51714
9	9810000008	\N	doctor	\N	\N	t	2025-10-11 19:29:55.577559	2025-10-11 19:29:55.577559
10	9810000009	\N	doctor	\N	\N	t	2025-10-11 19:29:55.637382	2025-10-11 19:29:55.637382
11	9810000010	\N	doctor	\N	\N	t	2025-10-11 19:29:55.696555	2025-10-11 19:29:55.696555
12	9810000011	\N	doctor	\N	\N	t	2025-10-11 19:29:55.757632	2025-10-11 19:29:55.757632
13	9810000012	\N	doctor	\N	\N	t	2025-10-11 19:29:55.81883	2025-10-11 19:29:55.81883
14	9810000013	\N	doctor	\N	\N	t	2025-10-11 19:29:55.882523	2025-10-11 19:29:55.882523
15	9810000014	\N	doctor	\N	\N	t	2025-10-11 19:29:55.941532	2025-10-11 19:29:55.941532
16	9810000015	\N	doctor	\N	\N	t	2025-10-11 19:29:56.002004	2025-10-11 19:29:56.002004
17	9810000016	\N	doctor	\N	\N	t	2025-10-11 19:29:56.062708	2025-10-11 19:29:56.062708
18	9810000017	\N	doctor	\N	\N	t	2025-10-11 19:29:56.122677	2025-10-11 19:29:56.122677
19	9810000018	\N	doctor	\N	\N	t	2025-10-11 19:29:56.186544	2025-10-11 19:29:56.186544
20	9810000019	\N	doctor	\N	\N	t	2025-10-11 19:29:56.245694	2025-10-11 19:29:56.245694
21	9810000020	\N	doctor	\N	\N	t	2025-10-11 19:29:56.305236	2025-10-11 19:29:56.305236
22	9810000021	\N	student	\N	\N	t	2025-10-11 19:29:56.365463	2025-10-11 19:29:56.365463
23	9810000022	\N	student	\N	\N	t	2025-10-11 19:29:56.425084	2025-10-11 19:29:56.425084
24	9810000023	\N	student	\N	\N	t	2025-10-11 19:29:56.485634	2025-10-11 19:29:56.485634
25	9810000024	\N	student	\N	\N	t	2025-10-11 19:29:56.546176	2025-10-11 19:29:56.546176
26	9810000025	\N	student	\N	\N	t	2025-10-11 19:29:56.606382	2025-10-11 19:29:56.606382
45	9111111113	\N	doctor	\N	\N	f	2025-10-12 06:00:52.581613	2025-10-12 06:00:52.581613
46	9222222224	\N	doctor	\N	\N	f	2025-10-12 06:00:52.645115	2025-10-12 06:00:52.645115
47	9333333335	\N	doctor	\N	\N	f	2025-10-12 06:00:52.702728	2025-10-12 06:00:52.702728
44	9000000003	\N	admin	123456	2025-10-12 06:11:13.497	t	2025-10-12 05:59:56.094027	2025-10-12 05:59:56.094027
49	9111111114	\N	doctor	000000	\N	t	2025-10-12 06:05:15.58	2025-10-12 06:05:15.58
1	9990172019	\N	doctor	123456	2025-10-11 20:41:32.101	f	2025-10-11 19:23:26.8097	2025-10-11 19:23:26.8097
30	9799720730	\N	doctor	123456	2025-10-11 20:42:12.297	t	2025-10-11 20:32:12.57293	2025-10-11 20:32:12.57293
50	9222222225	\N	doctor	000000	\N	t	2025-10-12 06:05:15.58	2025-10-12 06:05:15.58
48	9000000004	\N	admin	123456	2025-10-12 06:15:50.008	t	2025-10-12 06:04:33.974	2025-10-12 06:04:33.974
52	9999999992	doctor2@test.com	doctor	\N	\N	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
53	9999999993	student1@test.com	student	\N	\N	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
32	9988776655	\N	student	123456	2025-10-11 21:26:37.219	t	2025-10-11 21:13:54.459491	2025-10-11 21:13:54.459491
54	9999999994	student2@test.com	student	\N	\N	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
55	9999999995	doctor3@test.com	doctor	\N	\N	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
56	9999999996	student3@test.com	student	\N	\N	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
57	9999999997	doctor4@test.com	doctor	\N	\N	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
58	9999999998	student4@test.com	student	\N	\N	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
60	+919999999992	\N	doctor	123456	2025-10-12 06:55:12.681	t	2025-10-12 06:45:12.973651	2025-10-12 06:45:12.973651
61	+919999999993	\N	doctor	123456	2025-10-12 06:55:54.37	t	2025-10-12 06:45:54.654165	2025-10-12 06:45:54.654165
59	+919999999991	\N	doctor	123456	2025-10-12 07:11:59.002	t	2025-10-12 06:42:47.289146	2025-10-12 06:42:47.289146
51	9999999991	doctor1@test.com	doctor	123456	2025-10-12 07:42:24.597	t	2025-10-12 06:30:03.026169	2025-10-12 06:30:03.026169
29	9999999999	\N	admin	123456	2025-10-12 04:57:29.003	t	2025-10-11 20:13:57.611489	2025-10-11 20:13:57.611489
34	9111111111	\N	doctor	\N	\N	f	2025-10-12 05:51:22.011708	2025-10-12 05:51:22.011708
35	9222222222	\N	doctor	\N	\N	f	2025-10-12 05:51:22.073617	2025-10-12 05:51:22.073617
36	9333333333	\N	doctor	\N	\N	f	2025-10-12 05:51:22.130209	2025-10-12 05:51:22.130209
33	9000000001	\N	admin	123456	2025-10-12 06:01:47.507	t	2025-10-12 05:49:30.363236	2025-10-12 05:49:30.363236
63	+919999999999	\N	admin	123456	2025-10-12 11:05:59.579	t	2025-10-12 10:55:59.674947	2025-10-12 10:55:59.674947
41	9111111112	\N	doctor	\N	\N	f	2025-10-12 05:56:24.070609	2025-10-12 05:56:24.070609
42	9222222223	\N	doctor	\N	\N	f	2025-10-12 05:56:24.130432	2025-10-12 05:56:24.130432
43	9333333334	\N	doctor	\N	\N	f	2025-10-12 05:56:24.189363	2025-10-12 05:56:24.189363
37	9000000002	\N	admin	123456	2025-10-12 06:06:45.251	t	2025-10-12 05:55:25.070012	2025-10-12 05:55:25.070012
31	9876543210	\N	admin	123456	2025-10-12 11:33:48.785	t	2025-10-11 21:10:42.990264	2025-10-11 21:10:42.990264
28	+919876543210	\N	doctor	123456	2025-10-12 11:41:53.107	t	2025-10-11 19:53:50.922563	2025-10-11 19:53:50.922563
64	+91 9876543210	\N	doctor	123456	2025-10-12 11:59:16.484	f	2025-10-12 11:49:16.764193	2025-10-12 11:49:16.764193
\.


--
-- Name: ai_tool_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_tool_requests_id_seq', 9, true);


--
-- Name: bigtos_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bigtos_messages_id_seq', 37, true);


--
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.certificates_id_seq', 1, false);


--
-- Name: course_certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.course_certificates_id_seq', 1, false);


--
-- Name: course_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.course_modules_id_seq', 43, true);


--
-- Name: course_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.course_progress_id_seq', 17, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.courses_id_seq', 15, true);


--
-- Name: doctor_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.doctor_profiles_id_seq', 38, true);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 24, true);


--
-- Name: entity_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.entity_templates_id_seq', 1, true);


--
-- Name: hospitals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.hospitals_id_seq', 10, true);


--
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 13, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.jobs_id_seq', 30, true);


--
-- Name: masterclass_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.masterclass_bookings_id_seq', 12, true);


--
-- Name: masterclasses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.masterclasses_id_seq', 12, true);


--
-- Name: medical_voice_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.medical_voice_contacts_id_seq', 1, false);


--
-- Name: medical_voice_gathering_joins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.medical_voice_gathering_joins_id_seq', 1, false);


--
-- Name: medical_voice_supporters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.medical_voice_supporters_id_seq', 1, false);


--
-- Name: medical_voice_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.medical_voice_updates_id_seq', 1, false);


--
-- Name: medical_voices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.medical_voices_id_seq', 1, true);


--
-- Name: module_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.module_tests_id_seq', 10, true);


--
-- Name: npa_automation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.npa_automation_id_seq', 1, false);


--
-- Name: npa_opt_ins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.npa_opt_ins_id_seq', 1, false);


--
-- Name: npa_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.npa_templates_id_seq', 1, true);


--
-- Name: quiz_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quiz_attempts_id_seq', 22, true);


--
-- Name: quiz_leaderboard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quiz_leaderboard_id_seq', 1, true);


--
-- Name: quiz_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quiz_questions_id_seq', 76, true);


--
-- Name: quiz_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quiz_responses_id_seq', 5, true);


--
-- Name: quiz_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quiz_sessions_id_seq', 4, true);


--
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 11, true);


--
-- Name: research_service_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.research_service_requests_id_seq', 9, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.settings_id_seq', 10, true);


--
-- Name: test_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.test_questions_id_seq', 81, true);


--
-- Name: test_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.test_responses_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 64, true);


--
-- Name: ai_tool_requests ai_tool_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_tool_requests
    ADD CONSTRAINT ai_tool_requests_pkey PRIMARY KEY (id);


--
-- Name: bigtos_messages bigtos_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bigtos_messages
    ADD CONSTRAINT bigtos_messages_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: course_certificates course_certificates_certificate_number_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_certificates
    ADD CONSTRAINT course_certificates_certificate_number_unique UNIQUE (certificate_number);


--
-- Name: course_certificates course_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_certificates
    ADD CONSTRAINT course_certificates_pkey PRIMARY KEY (id);


--
-- Name: course_modules course_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_pkey PRIMARY KEY (id);


--
-- Name: course_progress course_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: doctor_profiles doctor_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor_profiles
    ADD CONSTRAINT doctor_profiles_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: entity_templates entity_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.entity_templates
    ADD CONSTRAINT entity_templates_pkey PRIMARY KEY (id);


--
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: masterclass_bookings masterclass_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.masterclass_bookings
    ADD CONSTRAINT masterclass_bookings_pkey PRIMARY KEY (id);


--
-- Name: masterclasses masterclasses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.masterclasses
    ADD CONSTRAINT masterclasses_pkey PRIMARY KEY (id);


--
-- Name: medical_voice_contacts medical_voice_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_contacts
    ADD CONSTRAINT medical_voice_contacts_pkey PRIMARY KEY (id);


--
-- Name: medical_voice_gathering_joins medical_voice_gathering_joins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_gathering_joins
    ADD CONSTRAINT medical_voice_gathering_joins_pkey PRIMARY KEY (id);


--
-- Name: medical_voice_supporters medical_voice_supporters_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_supporters
    ADD CONSTRAINT medical_voice_supporters_pkey PRIMARY KEY (id);


--
-- Name: medical_voice_updates medical_voice_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_updates
    ADD CONSTRAINT medical_voice_updates_pkey PRIMARY KEY (id);


--
-- Name: medical_voices medical_voices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voices
    ADD CONSTRAINT medical_voices_pkey PRIMARY KEY (id);


--
-- Name: medical_voices medical_voices_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voices
    ADD CONSTRAINT medical_voices_slug_unique UNIQUE (slug);


--
-- Name: module_tests module_tests_module_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_tests
    ADD CONSTRAINT module_tests_module_id_unique UNIQUE (module_id);


--
-- Name: module_tests module_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_tests
    ADD CONSTRAINT module_tests_pkey PRIMARY KEY (id);


--
-- Name: npa_automation npa_automation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_automation
    ADD CONSTRAINT npa_automation_pkey PRIMARY KEY (id);


--
-- Name: npa_opt_ins npa_opt_ins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_opt_ins
    ADD CONSTRAINT npa_opt_ins_pkey PRIMARY KEY (id);


--
-- Name: npa_opt_ins npa_opt_ins_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_opt_ins
    ADD CONSTRAINT npa_opt_ins_user_id_unique UNIQUE (user_id);


--
-- Name: npa_templates npa_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_templates
    ADD CONSTRAINT npa_templates_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quiz_leaderboard quiz_leaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_leaderboard
    ADD CONSTRAINT quiz_leaderboard_pkey PRIMARY KEY (id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- Name: quiz_responses quiz_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_responses
    ADD CONSTRAINT quiz_responses_pkey PRIMARY KEY (id);


--
-- Name: quiz_sessions quiz_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_sessions
    ADD CONSTRAINT quiz_sessions_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: research_service_requests research_service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.research_service_requests
    ADD CONSTRAINT research_service_requests_pkey PRIMARY KEY (id);


--
-- Name: settings settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_unique UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: test_questions test_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_questions
    ADD CONSTRAINT test_questions_pkey PRIMARY KEY (id);


--
-- Name: test_responses test_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_responses
    ADD CONSTRAINT test_responses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_phone_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_unique UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ai_tool_requests ai_tool_requests_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_tool_requests
    ADD CONSTRAINT ai_tool_requests_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: certificates certificates_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: course_certificates course_certificates_course_id_courses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_certificates
    ADD CONSTRAINT course_certificates_course_id_courses_id_fk FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_certificates course_certificates_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_certificates
    ADD CONSTRAINT course_certificates_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: course_modules course_modules_course_id_courses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_courses_id_fk FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: course_progress course_progress_enrollment_id_enrollments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_enrollment_id_enrollments_id_fk FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id);


--
-- Name: course_progress course_progress_module_id_course_modules_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_module_id_course_modules_id_fk FOREIGN KEY (module_id) REFERENCES public.course_modules(id);


--
-- Name: doctor_profiles doctor_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.doctor_profiles
    ADD CONSTRAINT doctor_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: enrollments enrollments_course_id_courses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_courses_id_fk FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: enrollments enrollments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: job_applications job_applications_job_id_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: job_applications job_applications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: jobs jobs_hospital_id_hospitals_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_hospital_id_hospitals_id_fk FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id);


--
-- Name: jobs jobs_posted_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_posted_by_users_id_fk FOREIGN KEY (posted_by) REFERENCES public.users(id);


--
-- Name: masterclass_bookings masterclass_bookings_masterclass_id_masterclasses_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.masterclass_bookings
    ADD CONSTRAINT masterclass_bookings_masterclass_id_masterclasses_id_fk FOREIGN KEY (masterclass_id) REFERENCES public.masterclasses(id);


--
-- Name: masterclass_bookings masterclass_bookings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.masterclass_bookings
    ADD CONSTRAINT masterclass_bookings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: medical_voice_contacts medical_voice_contacts_voice_id_medical_voices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_contacts
    ADD CONSTRAINT medical_voice_contacts_voice_id_medical_voices_id_fk FOREIGN KEY (voice_id) REFERENCES public.medical_voices(id);


--
-- Name: medical_voice_gathering_joins medical_voice_gathering_joins_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_gathering_joins
    ADD CONSTRAINT medical_voice_gathering_joins_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: medical_voice_gathering_joins medical_voice_gathering_joins_voice_id_medical_voices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_gathering_joins
    ADD CONSTRAINT medical_voice_gathering_joins_voice_id_medical_voices_id_fk FOREIGN KEY (voice_id) REFERENCES public.medical_voices(id);


--
-- Name: medical_voice_supporters medical_voice_supporters_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_supporters
    ADD CONSTRAINT medical_voice_supporters_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: medical_voice_supporters medical_voice_supporters_voice_id_medical_voices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_supporters
    ADD CONSTRAINT medical_voice_supporters_voice_id_medical_voices_id_fk FOREIGN KEY (voice_id) REFERENCES public.medical_voices(id);


--
-- Name: medical_voice_updates medical_voice_updates_voice_id_medical_voices_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voice_updates
    ADD CONSTRAINT medical_voice_updates_voice_id_medical_voices_id_fk FOREIGN KEY (voice_id) REFERENCES public.medical_voices(id);


--
-- Name: medical_voices medical_voices_creator_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medical_voices
    ADD CONSTRAINT medical_voices_creator_id_users_id_fk FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: module_tests module_tests_module_id_course_modules_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_tests
    ADD CONSTRAINT module_tests_module_id_course_modules_id_fk FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;


--
-- Name: npa_automation npa_automation_opt_in_id_npa_opt_ins_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_automation
    ADD CONSTRAINT npa_automation_opt_in_id_npa_opt_ins_id_fk FOREIGN KEY (opt_in_id) REFERENCES public.npa_opt_ins(id);


--
-- Name: npa_automation npa_automation_template_used_npa_templates_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_automation
    ADD CONSTRAINT npa_automation_template_used_npa_templates_id_fk FOREIGN KEY (template_used) REFERENCES public.npa_templates(id);


--
-- Name: npa_automation npa_automation_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_automation
    ADD CONSTRAINT npa_automation_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: npa_opt_ins npa_opt_ins_doctor_profile_id_doctor_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_opt_ins
    ADD CONSTRAINT npa_opt_ins_doctor_profile_id_doctor_profiles_id_fk FOREIGN KEY (doctor_profile_id) REFERENCES public.doctor_profiles(id);


--
-- Name: npa_opt_ins npa_opt_ins_template_id_npa_templates_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_opt_ins
    ADD CONSTRAINT npa_opt_ins_template_id_npa_templates_id_fk FOREIGN KEY (template_id) REFERENCES public.npa_templates(id);


--
-- Name: npa_opt_ins npa_opt_ins_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.npa_opt_ins
    ADD CONSTRAINT npa_opt_ins_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: quiz_attempts quiz_attempts_quiz_id_quizzes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_quiz_id_quizzes_id_fk FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id);


--
-- Name: quiz_attempts quiz_attempts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: quiz_leaderboard quiz_leaderboard_quiz_id_quizzes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_leaderboard
    ADD CONSTRAINT quiz_leaderboard_quiz_id_quizzes_id_fk FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id);


--
-- Name: quiz_leaderboard quiz_leaderboard_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_leaderboard
    ADD CONSTRAINT quiz_leaderboard_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: quiz_questions quiz_questions_quiz_id_quizzes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_quiz_id_quizzes_id_fk FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id);


--
-- Name: quiz_responses quiz_responses_question_id_quiz_questions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_responses
    ADD CONSTRAINT quiz_responses_question_id_quiz_questions_id_fk FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id);


--
-- Name: quiz_responses quiz_responses_quiz_id_quizzes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_responses
    ADD CONSTRAINT quiz_responses_quiz_id_quizzes_id_fk FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id);


--
-- Name: quiz_responses quiz_responses_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_responses
    ADD CONSTRAINT quiz_responses_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: quiz_sessions quiz_sessions_quiz_id_quizzes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_sessions
    ADD CONSTRAINT quiz_sessions_quiz_id_quizzes_id_fk FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id);


--
-- Name: research_service_requests research_service_requests_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.research_service_requests
    ADD CONSTRAINT research_service_requests_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: research_service_requests research_service_requests_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.research_service_requests
    ADD CONSTRAINT research_service_requests_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: test_questions test_questions_test_id_module_tests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_questions
    ADD CONSTRAINT test_questions_test_id_module_tests_id_fk FOREIGN KEY (test_id) REFERENCES public.module_tests(id) ON DELETE CASCADE;


--
-- Name: test_responses test_responses_question_id_test_questions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_responses
    ADD CONSTRAINT test_responses_question_id_test_questions_id_fk FOREIGN KEY (question_id) REFERENCES public.test_questions(id);


--
-- Name: test_responses test_responses_test_id_module_tests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_responses
    ADD CONSTRAINT test_responses_test_id_module_tests_id_fk FOREIGN KEY (test_id) REFERENCES public.module_tests(id);


--
-- Name: test_responses test_responses_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.test_responses
    ADD CONSTRAINT test_responses_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

