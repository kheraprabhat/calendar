import { Event } from './types';
import DatePicker from 'react-datepicker';
import { v4 as UUID } from 'uuid';
import * as Yup from 'yup';

import "react-datepicker/dist/react-datepicker.css";

import {
  Form,
  Field,
  withFormik,
  FormikProps,
  FormikErrors,
  useFormikContext,
  useField,
  FormikBag
} from 'formik';
import moment from 'moment';

interface AddEventFormProps {
  onAddEvent: (event: Event) => void;
  onEditEvent: (event: Event) => void;
  resetEventForm: () => void;
  initialValues: Event;
}

interface Props {
  name: string;
  value: Date | null;
  onChange: (value: Number) => void;
  errors?: FormikErrors<string>;
}

const DateTimeField = ({ onChange, value, ...props }: Props) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const filterPassedTime = (time: any) => { // TODO
    const currentDate = moment();
    const selectedDate = moment(time);

    return currentDate < selectedDate;
  };

  return (
    <DatePicker
      showTimeSelect
      timeIntervals={15}
      selected={field.value && moment.unix(field.value).toDate()}
      onChange={d => {
        const date = moment(d).unix();
        setFieldValue(field.name, date);
      }}
      filterTime={filterPassedTime}
      dateFormat='MMMM d, yyyy h:mm aa'
      {...props}
    />
  );
}

const InnerForm = (props: AddEventFormProps & FormikProps<Event>) => {
  const { touched, isSubmitting, errors, values } = props;
  function handleReset() {
    props.resetForm();
    props.resetEventForm();
  }
  return (
    <Form className='events-form'>
      <h1>{values.id ? 'Edit' : 'Add'} an event</h1>
      <Field type="hidden" name="id" />
      <div className='events-form__field'>
        <label htmlFor="title">Title</label>
        <Field id="title" name="title" placeholder="Title" />
        {touched.title && errors.title && <div className='events-form__error'>{errors.title}</div>}
      </div>
      <div className='events-form__field'>
        <label htmlFor="description">Description</label>
        <Field id="description" name="description" placeholder="Description" as="textarea" />
        {touched.description && errors.description && <div className='events-form__error'>{errors.description}</div>}
      </div>
      <div className='events-form__field'>
        <label htmlFor="startDate">Start Time</label>
        <Field id="startDate" name="startDate" placeholder="Start Date" as={DateTimeField} />
        {touched.startDate && errors.startDate && <div className='events-form__error'>Required</div>}
      </div>
      <div className='events-form__field'>
        <label htmlFor="endDate">End Time</label>
        <Field id="endDate" name="endDate" placeholder="End Date" as={DateTimeField} />
        {touched.endDate && errors.endDate && <div className='events-form__error'>Required</div>}
      </div>
      <button className='events-form__submit' type="submit" disabled={isSubmitting}>Submit</button>
      <button className='events-form__reset' type="reset" onClick={handleReset}>Reset</button>
    </Form>
  );
};

const validationSchema = Yup.object().shape({
  id: Yup.string(),
  title: Yup.string()
    .required('Title is required'),
  description: Yup.string()
    .required('Description is required'),
  startDate: Yup.string()
    .required('Start date is required'),
  endDate: Yup.string()
    .required('End date is required'),
});

function handleSubmit(values: Event, { props, setSubmitting }: FormikBag<AddEventFormProps, Event>) {
  if (values.id) {
    props.onEditEvent(values);
  } else {
    values.id = UUID();
    props.onAddEvent(values);
  }
  setSubmitting(false);
  props.resetEventForm();
}

const AddEventForm = withFormik<AddEventFormProps, Event>({
  mapPropsToValues: props => {
    return {
      ...props.initialValues
    };
  },
  validationSchema,
  handleSubmit,

  enableReinitialize: true,
})(InnerForm);

export default function AddEvent({
  onAddEvent,
  onEditEvent,
  resetEventForm,
  editEvent
}: {
  onAddEvent: (event: Event) => void,
  onEditEvent: (event: Event) => void,
  resetEventForm: () => void,
  editEvent?: Event
}) {
  const initialValues: Event = editEvent ?? {
    id: '',
    title: '',
    description: '',
    startDate: moment().unix(),
    endDate: moment().unix(),
  };
  return (<AddEventForm
    onAddEvent={onAddEvent}
    onEditEvent={onEditEvent}
    initialValues={initialValues}
    resetEventForm={resetEventForm}
  />)
}
