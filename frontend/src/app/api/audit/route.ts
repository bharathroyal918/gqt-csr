import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { module, action, resourceId, oldValue, newValue, userEmail, userRole } = body;

    if (!module || !action) {
      return NextResponse.json({ error: "module and action are required" }, { status: 400 });
    }

    const auditEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail: userEmail || "system@globalquesttechnologies.com",
      userRole: userRole || "super_admin",
      module,
      action,
      resourceId,
      oldValue,
      newValue,
      status: "IMMUTABLE_LOGGED",
    };

    return NextResponse.json({
      success: true,
      log: auditEntry,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
