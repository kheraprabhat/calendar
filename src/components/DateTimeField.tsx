import DatePicker from 'react-datepicker';
import {
  FormikErrors,
  useFormikContext,
  useField,
} from 'formik';
import moment from 'moment';

interface DateTimeFieldProps {
  name: string;
  value: Date | null;
  onChange: (value: Number) => void;
  errors?: FormikErrors<string>;
}

export const DateTimeField = ({ onChange, value, ...props }: DateTimeFieldProps) => {
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