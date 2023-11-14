import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import './presentation.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _formKey = GlobalKey<FormState>();
  String code = '';
  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Center(
        child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                TextFormField(
                  onSaved: (String? value) => {if (value != null) code = value},
                  decoration: const InputDecoration(
                    hintText: 'Presentation code...',
                    labelText: 'Join Presentation',
                  ),
                  validator: validateCode,
                ),
                ElevatedButton(
                  onPressed: submitCode,
                  child: const Text('Submit'),
                ),
              ],
            )),
      ),
    );
  }

  String? validateCode(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter the code!';
    }
    return null;
  }

  void submitCode() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      if (context.mounted) {
        bool results = await checkCode();
        if (results) {
          Navigator.of(context).push(MaterialPageRoute(
            builder: (context) => PresentationPage(code: code),
          ));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Presentation not found!')));
        }
      }
    }
  }

  Future<bool> checkCode() async {
    final response =
        await http.get(Uri.parse('${dotenv.env['PRESENTATIONS_ROUTE']}/$code'));

    return (response.statusCode == 200);
  }
}
