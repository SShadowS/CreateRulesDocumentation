import { walk } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const ANALYSIS_PROMPT = `<examples>
<example>
<code>
namespace STM.BusinessCentral.Sentinel;

using Microsoft.Foundation.NoSeries;
using Microsoft.Purchases.Setup;
using Microsoft.Sales.Setup;
using STM.BusinessCentral.Sentinel;

codeunit 71180281 NonPostNoSeriesGapsSESTM implements IAuditAlertSESTM
{
    Access = Internal;
    Permissions =
        tabledata AlertSESTM = RI,
        tabledata "No. Series" = R,
        tabledata "No. Series Line" = R,
        tabledata "Purchases & Payables Setup" = R,
        tabledata "Sales & Receivables Setup" = R;

    procedure CreateAlerts()
    begin
        CheckSalesSetup();
        CheckPurchaseSetup();
    end;

    local procedure CheckPurchaseSetup()
    var
        PurchaseSetup: Record "Purchases & Payables Setup";
    begin
        PurchaseSetup.ReadIsolation(IsolationLevel::ReadUncommitted);
        PurchaseSetup.SetLoadFields("Order Nos.", "Invoice Nos.", "Credit Memo Nos.", "Quote Nos.", "Vendor Nos.", "Blanket Order Nos.", "Price List Nos.", "Return Order Nos.");
        if not PurchaseSetup.Get() then
            exit;

        CheckNoSeries(PurchaseSetup."Order Nos.");
        CheckNoSeries(PurchaseSetup."Invoice Nos.");
        CheckNoSeries(PurchaseSetup."Credit Memo Nos.");
        CheckNoSeries(PurchaseSetup."Quote Nos.");
        CheckNoSeries(PurchaseSetup."Vendor Nos.");
        CheckNoSeries(PurchaseSetup."Blanket Order Nos.");
        CheckNoSeries(PurchaseSetup."Price List Nos.");
        CheckNoSeries(PurchaseSetup."Return Order Nos.");
    end;

    local procedure CheckSalesSetup()
    var
        SalesSetup: Record "Sales & Receivables Setup";
    begin
        SalesSetup.ReadIsolation(IsolationLevel::ReadUncommitted);
        SalesSetup.SetLoadFields("Order Nos.", "Invoice Nos.", "Credit Memo Nos.", "Quote Nos.", "Customer Nos.", "Blanket Order Nos.", "Reminder Nos.", "Fin. Chrg. Memo Nos.", "Direct Debit Mandate Nos.", "Price List Nos.");
        if not SalesSetup.Get() then
            exit;

        CheckNoSeries(SalesSetup."Order Nos.");
        CheckNoSeries(SalesSetup."Invoice Nos.");
        CheckNoSeries(SalesSetup."Credit Memo Nos.");
        CheckNoSeries(SalesSetup."Quote Nos.");
        CheckNoSeries(SalesSetup."Customer Nos.");
        CheckNoSeries(SalesSetup."Blanket Order Nos.");
        CheckNoSeries(SalesSetup."Reminder Nos.");
        CheckNoSeries(SalesSetup."Fin. Chrg. Memo Nos.");
        CheckNoSeries(SalesSetup."Direct Debit Mandate Nos.");
        CheckNoSeries(SalesSetup."Price List Nos.");
    end;

    local procedure CheckNoSeries(NoSeriesCode: Code[20])
    var
        Alert: Record AlertSESTM;
        NoSeriesLine: Record "No. Series Line";
        NoSeriesSingle: Interface "No. Series - Single";
        ActionRecommendationLbl: Label 'Change No Series %1 to allow gaps', Comment = '%1 = No. Series Code';
        LongDescLbl: Label 'The No. Series %1 does not allow gaps and is responsible for non-posting documents/records. Consider configuring the No. Series to allow gaps to increase performance and decrease locking.', Comment = '%1 = No. Series Code';
        ShortDescLbl: Label 'No Series %1 does not allow gaps', Comment = '%1 = No. Series Code';
    begin
        NoSeriesLine.SetRange("Series Code", NoSeriesCode);
        if NoSeriesLine.FindSet() then
            repeat
                NoSeriesSingle := NoSeriesLine.Implementation;
                if not NoSeriesSingle.MayProduceGaps() then
                    Alert.New(
                        AlertCodeSESTM::"SE-000006",
                        StrSubstNo(ShortDescLbl, NoSeriesCode),
                        SeveritySESTM::Warning,
                        AreaSESTM::Performance,
                        StrSubstNo(LongDescLbl, NoSeriesCode),
                        StrSubstNo(ActionRecommendationLbl, NoSeriesCode),
                        NoSeriesCode
                    );
            until NoSeriesLine.Next() = 0;
    end;

    procedure ShowMoreDetails(var Alert: Record AlertSESTM)
    var
        WikiLinkTok: Label 'https://github.com/StefanMaron/BusinessCentral.Sentinel/wiki/SE-000006', Locked = true;
    begin
        Hyperlink(WikiLinkTok);
    end;

    procedure ShowRelatedInformation(var Alert: Record AlertSESTM)
    var
        NoSeries: Record "No. Series";
        OpenRecordQst: Label 'Do you want to open the No. Series %1?', Comment = '%1 = No. Series Code';
    begin
        if not Confirm(StrSubstNo(OpenRecordQst, Alert.UniqueIdentifier)) then
            exit;

        NoSeries.SetRange("Code", Alert.UniqueIdentifier);
        Page.Run(Page::"No. Series", NoSeries);
    end;

    procedure AutoFix(var Alert: Record AlertSESTM)
    begin

    end;
}
</code>
<ideal_output>
<code_analysis>
a. Rule ID: SE-000006
b. Purpose: This rule checks for number series configurations in Business Central that don't allow gaps in both Sales and Purchase setups.
c. What the rule checks:
   - Purchase-related number series for: Orders, Invoices, Credit Memos, Quotes, Vendor Numbers, Blanket Orders, Price Lists, Return Orders
   - Sales-related number series for: Orders, Invoices, Credit Memos, Quotes, Customer Numbers, Blanket Orders, Reminders, Finance Charge Memos, Direct Debit Mandates, Price Lists
d. Why the rule matters: Number series that don't allow gaps can cause performance issues and locking problems in Business Central.
e. Recommendation: Change the identified number series to allow gaps to improve performance and reduce locking issues.
f. Severity: Warning
   Area: Performance
</code_analysis>

**Rule ID: SE-000006**  
**Purpose**: This rule checks for number series configurations in Business Central that don't allow gaps in both Sales and Purchase setups.
 
**What it checks**:
1. **Purchase-related number series** for:
   - Orders
   - Invoices
   - Credit Memos
   - Quotes
   - Vendor Numbers
   - Blanket Orders
   - Price Lists
   - Return Orders
 
2. **Sales-related number series** for:
   - Orders
   - Invoices
   - Credit Memos
   - Quotes
   - Customer Numbers
   - Blanket Orders
   - Reminders
   - Finance Charge Memos
   - Direct Debit Mandates
   - Price Lists
 
**Why it matters**: Number series that don't allow gaps can cause performance issues and locking problems in Business Central. The rule generates a warning alert when it finds such configurations.
 
**Recommendation**: When identified, it suggests changing the number series to allow gaps to improve performance and reduce locking issues.
 
**Severity**: Warning
**Area**: Performance
</ideal_output>
</example>
</examples>

You are an expert in analyzing Business Central AL code and creating documentation for a security product called Sentinel. Your task is to review the provided AL code and generate a concise summary of the rule it implements.

Here's the AL code you need to analyze:

<code>
${content}</code>

Please follow these steps to create your summary:

1. Carefully analyze the provided AL code.
2. Identify the key components of the rule, including its ID, purpose, what it checks, why it matters, and any recommendations.
3. Wrap your analysis inside <code_analysis> tags, following these steps:
   a. Identify the rule ID
   b. Determine the rule's purpose
   c. List what the rule checks
   d. Explain why the rule matters
   e. Formulate a recommendation
   f. Determine severity and area
4. Based on your analysis, create a structured summary following the exact format provided below.

Your final output must adhere to this structure:

\`\`\`
**Rule ID: [ID]**
**Purpose**: [Brief description of what the rule does]

**What it checks**:
[List of items or configurations the rule examines]

**Why it matters**: [Explanation of the rule's importance and potential consequences]

**Recommendation**: [Suggested action or best practice]

**Severity**: [Severity level]
**Area**: [Relevant area in Business Central]
\`\`\`

Remember to fill in the placeholders with the appropriate information derived from your code analysis. Ensure that your summary is concise, accurate, and follows this structure exactly.

Begin your response with your analysis, then provide the formatted summary.`;

async function processSingleFile(filePath: string, outputDir: string, apiKey: string) {
  try {
    await Deno.mkdir(outputDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  const content = await Deno.readTextFile(filePath);
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2532,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: ANALYSIS_PROMPT
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  const fileName = filePath.split(/[\\/]/).pop() ?? '';
  const outputFilename = fileName.replace('.al', '.md');
  const outputPath = join(outputDir, outputFilename);
  
  const text = result.content[0].text;
  const markdownContent = text.split('</code_analysis>')[1]?.trim() ?? text;
  await Deno.writeTextFile(outputPath, markdownContent);
  
  console.log(`Processed ${fileName} -> ${outputFilename}`);
}

async function processALFiles(inputDir: string, outputDir: string, apiKey: string) {
  try {
    await Deno.mkdir(outputDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  for await (const entry of walk(inputDir, { 
    exts: ['.al'],
    followSymlinks: false 
  })) {
    if (entry.isFile) {
      const content = await Deno.readTextFile(entry.path);
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2532,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: ANALYSIS_PROMPT
                }
              ]
            },
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "<code_analysis>"
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      const outputFilename = entry.name.replace('.al', '.md');
      const outputPath = join(outputDir, outputFilename);
      
      // Extract only the content after </code_analysis>
      const text = result.content[0].text;
      const markdownContent = text.split('</code_analysis>')[1]?.trim() ?? text;
      await Deno.writeTextFile(outputPath, markdownContent);
      
      console.log(`Processed ${entry.name} -> ${outputFilename}`);
    }
  }
}

// Get command line arguments
const args = Deno.args;
if (args.length !== 2) {
  console.error("Usage: deno run --allow-read --allow-write --allow-net --allow-env process_al_files.ts <input_path> <output_dir>");
  console.error("input_path can be either a directory containing .al files or a single .al file");
  Deno.exit(1);
}

const [inputPath, outputDir] = args;
const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

if (!apiKey) {
  console.error("Please set ANTHROPIC_API_KEY environment variable");
  Deno.exit(1);
}

// Validate input path
try {
  const inputPathInfo = await Deno.stat(inputPath);
  if (!inputPathInfo.isDirectory && !inputPath.endsWith('.al')) {
    console.error(`Error: ${inputPath} is neither a directory nor an .al file`);
    Deno.exit(1);
  }
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error(`Error: Input path ${inputPath} does not exist`);
    Deno.exit(1);
  }
  throw error;
}

// Process either directory or single file
if ((await Deno.stat(inputPath)).isDirectory) {
  await processALFiles(inputPath, outputDir, apiKey);
} else {
  await processSingleFile(inputPath, outputDir, apiKey);
}
