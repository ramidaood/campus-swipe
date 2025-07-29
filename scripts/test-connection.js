import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ibtqysxchuqcqcafbyzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidHF5c3hjaHVxY3FjYWZieXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTI2ODksImV4cCI6MjA2OTI4ODY4OX0.51ABZfrIUef9YD2NM6HdMIW4SLoHnifdyUsk2TG7xXc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');

    // Test basic connection
    const { data, error } = await supabase
      .from('apartments')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('💡 Make sure you have:');
      console.log('   1. Run the migration in Supabase dashboard');
      console.log('   2. Created the apartments table');
      console.log('   3. Set up proper RLS policies');
      return;
    }

    console.log('✅ Connection successful!');
    console.log('📊 Data:', data);

    // Test institutions table
    const { data: institutions, error: institutionsError } = await supabase
      .from('institutions')
      .select('*')
      .limit(1);

    if (institutionsError) {
      console.log('❌ Institutions table error:', institutionsError.message);
    } else {
      console.log('✅ Institutions table accessible');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection(); 